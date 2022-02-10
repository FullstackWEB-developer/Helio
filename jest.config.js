module.exports = {
    "transform": {
        "^.+\\.tsx?$": "ts-jest",
        '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
            'jest-transform-stub'
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "moduleDirectories": [
        "node_modules",
        "src"
    ],
    "moduleNameMapper": {
        "@icons/(.*)": "<rootDir>/src/shared/icons/$1",
        "@components/(.*)": "<rootDir>/src/shared/components/$1",
        "@constants/(.*)": "<rootDir>/src/shared/constants/$1",
        "@pages/(.*)": "<rootDir>/src/pages/$1",
        "@shared/(.*)": "<rootDir>/src/shared/$1",
        "@app/(.*)": "<rootDir>/src/app/$1"
    }
};
