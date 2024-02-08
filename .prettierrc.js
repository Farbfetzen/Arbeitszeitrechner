module.exports = {
    // prettier-plugin-tailwindcss must be loaded last, see
    // https://github.com/tailwindlabs/prettier-plugin-tailwindcss#compatibility-with-other-prettier-plugins
    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],

    // Plugin: '@trivago/prettier-plugin-sort-imports'
    importOrder: ["^zone.js", "^@angular", "^@|^rxjs", "^src"],
    importOrderCaseInsensitive: true,
    importOrderParserPlugins: ["typescript", "decorators-legacy"],
    importOrderSeparation: true,
};
