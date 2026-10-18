import {
  assertBackendReady,
  countryCode,
  isRedirect,
  storeCode,
  uniqueEmail,
} from "./test-helpers"
import {
  addCustomerAddress,
  deleteCustomerAddress,
  login,
  loginCustomer,
  registerCustomer,
  retrieveCustomer,
  signOutCustomer,
  signout,
  signup,
  transferCart,
  updateCustomer,
  updateCustomerAddress,
} from "./customer"

const password = "supersecret"

beforeAll(async () => {
  await assertBackendReady()
})

describe("customer", () => {
  describe("retrieveCustomer", () => {
    it("returns null when the shopper is not signed in", async () => {
      await expect(retrieveCustomer(storeCode())).resolves.toBeNull()
    })
  })

  describe("registerCustomer", () => {
    it("creates a customer and stores the auth cookie", async () => {
      const email = uniqueEmail("register")
      const result = await registerCustomer({
        storeCode: storeCode(),
        firstName: "Aero",
        lastName: "Trek",
        email,
        password,
        phone: "7770001",
      })

      expect(result.success).toBe(true)
      if (!result.success) {
        return
      }

      expect(result.customer?.email).toBe(email)
      await expect(retrieveCustomer(storeCode())).resolves.toEqual(
        expect.objectContaining({ email })
      )
    })

    it("returns an error for a duplicate email", async () => {
      const email = uniqueEmail("dup")
      const first = await registerCustomer({
        storeCode: storeCode(),
        firstName: "One",
        email,
        password,
      })
      expect(first.success).toBe(true)

      await signOutCustomer()

      const second = await registerCustomer({
        storeCode: storeCode(),
        firstName: "Two",
        email,
        password,
      })

      expect(second.success).toBe(false)
    })
  })

  describe("loginCustomer", () => {
    it("returns an error for a bad password", async () => {
      const result = await loginCustomer({
        storeCode: storeCode(),
        email: uniqueEmail("missing"),
        password: "wrong-password",
      })

      expect(result.success).toBe(false)
    })

    it("signs in an existing customer", async () => {
      const email = uniqueEmail("login")
      const created = await registerCustomer({
        storeCode: storeCode(),
        firstName: "Login",
        lastName: "User",
        email,
        password,
      })
      expect(created.success).toBe(true)
      await signOutCustomer()

      const result = await loginCustomer({
        storeCode: storeCode(),
        email,
        password,
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.customer?.email).toBe(email)
      }
    })
  })

  describe("signup / login form actions", () => {
    it("signup returns the customer on success", async () => {
      const email = uniqueEmail("signup")
      const form = new FormData()
      form.set("email", email)
      form.set("password", password)
      form.set("first_name", "Form")
      form.set("last_name", "User")
      form.set("phone", "7770002")

      const customer = await signup(storeCode(), null, form)
      expect(typeof customer).not.toBe("string")
      expect(customer).toEqual(expect.objectContaining({ email }))
    })

    it("login succeeds for a registered email", async () => {
      const email = uniqueEmail("form-login")
      const created = await registerCustomer({
        storeCode: storeCode(),
        firstName: "Form",
        email,
        password,
      })
      expect(created.success).toBe(true)
      await signOutCustomer()

      const form = new FormData()
      form.set("email", email)
      form.set("password", password)

      await expect(login(storeCode(), null, form)).resolves.toBeUndefined()
      await expect(retrieveCustomer(storeCode())).resolves.toEqual(
        expect.objectContaining({ email })
      )
    })
  })

  describe("updateCustomer", () => {
    it("updates the signed-in profile", async () => {
      const email = uniqueEmail("update")
      const created = await registerCustomer({
        storeCode: storeCode(),
        firstName: "Before",
        lastName: "Name",
        email,
        password,
      })
      expect(created.success).toBe(true)

      const updated = await updateCustomer(storeCode(), { first_name: "After" })
      expect(updated.success).toBe(true)
      if (updated.success) {
        expect(updated.customer?.first_name).toBe("After")
      }
    })
  })

  describe("addresses", () => {
    it("requires an address id for update and delete", async () => {
      await expect(deleteCustomerAddress(storeCode(), "")).resolves.toEqual({
        success: false,
        error: "Address ID is required",
      })
      await expect(
        updateCustomerAddress(storeCode(), "", { city: "Male" })
      ).resolves.toEqual({
        success: false,
        error: "Address ID is required",
      })
    })

    it("adds, updates, and deletes an address", async () => {
      const created = await registerCustomer({
        storeCode: storeCode(),
        firstName: "Addr",
        lastName: "User",
        email: uniqueEmail("addr"),
        password,
      })
      expect(created.success).toBe(true)

      const added = await addCustomerAddress(storeCode(), {
        first_name: "Addr",
        last_name: "User",
        address_1: "2 Marine Drive",
        city: "Male",
        postal_code: "20000",
        country_code: countryCode(),
      })

      expect(added.success).toBe(true)
      const addressId = added.success
        ? added.customer?.addresses?.[0]?.id
        : undefined
      expect(addressId).toBeTruthy()

      const updated = await updateCustomerAddress(storeCode(), addressId!, {
        city: "Addu",
      })
      expect(updated.success).toBe(true)

      const deleted = await deleteCustomerAddress(storeCode(), addressId!)
      expect(deleted.success).toBe(true)
    })
  })

  describe("signOutCustomer", () => {
    it("clears the session so retrieveCustomer is null", async () => {
      const created = await registerCustomer({
        storeCode: storeCode(),
        firstName: "Out",
        email: uniqueEmail("out"),
        password,
      })
      expect(created.success).toBe(true)

      await expect(signOutCustomer()).resolves.toEqual({ success: true })
      await expect(retrieveCustomer(storeCode())).resolves.toBeNull()
    })
  })

  describe("signout", () => {
    it("clears cookies and redirects to login-register", async () => {
      const created = await registerCustomer({
        storeCode: storeCode(),
        firstName: "Redirect",
        email: uniqueEmail("redirect"),
        password,
      })
      expect(created.success).toBe(true)

      try {
        await signout(countryCode())
        throw new Error("expected redirect")
      } catch (error) {
        expect(isRedirect(error, `/${countryCode()}/login-register`)).toBe(true)
      }

      await expect(retrieveCustomer(storeCode())).resolves.toBeNull()
    })
  })

  describe("transferCart", () => {
    it("returns without a cart cookie", async () => {
      await expect(transferCart(storeCode())).resolves.toBeUndefined()
    })
  })
})
