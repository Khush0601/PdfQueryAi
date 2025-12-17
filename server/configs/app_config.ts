// configs/app_config.ts

interface IAppConfig {
  PORT: number;
}

// Use environment variable or fallback to 5000
const AppConfig: IAppConfig = {
  PORT: Number(process.env.PORT) || 7000,
};

export default AppConfig;
