module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  clearMocks: true,
  coverageDirectory: "coverage",
  /**
   *  If you comment this out, you will get error unexpected token with optional chaining because you are using babel in your project
   *  When using babel together with ts-jest in a project, you need to let ts-jest know about it
   */
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  // Indicates whether each individual test should be reported during the run
  verbose: true
};
