type RequiredEnv = {
  key: string;
  description: string;
};

const requiredEnvs: RequiredEnv[] = [
  {
    key: "NEXT_PUBLIC_AIMINAABEE_PUBLISHABLE_KEY",
    description: "Publishable key used by Aiminaabee storefront API requests.",
  },
  {
    key: "NEXT_PUBLIC_DEFAULT_STORE_CODE",
    description: "Store code used as the first argument for Aiminaabee SDK calls.",
  },
];

export default function checkEnvVariables() {
  const missingEnvs = requiredEnvs.filter((env) => !process.env[env.key]);

  if (!missingEnvs.length) {
    return;
  }

  console.error("\nError: Missing required Aerotrek storefront environment variables\n");
  missingEnvs.forEach((env) => {
    console.error(`  ${env.key}`);
    console.error(`    ${env.description}\n`);
  });
  process.exit(1);
}
