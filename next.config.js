/** @type {import('next').NextConfig} */
const withReactSvg = require('next-react-svg')
const path = require('path')

const ContentSecurityPolicy = `
    script-src * data: ${process.env.URL}  'unsafe-inline' 'unsafe-eval' ${process.env.NEXT_PUBLIC_SHA_KEY};
`
//child-src example.com;
const securityHeaders = [
    {
        key: 'Content-Security-Policy',
        value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
    }
]


module.exports = withReactSvg({
    include: path.resolve(__dirname, 'src/assets/icons'),
    async redirects() {
        return [
            {
                source: '/san-pham/:slug',
                destination: '/:slug.html',
                permanent: true
            },
        ]
    },
    future: {
        excludeDefaultMomentLocales: true
    },
    async rewrites() {
        return [
            {
                source: '/:slug.html',
                destination: '/san-pham/:slug',
            },
            
        ]
    },
    reactStrictMode: false,
    trailingSlash: false,
    async headers() {
        return [
          {
            // Apply these headers to all routes in your application.
            source: '/:path*',
            headers: securityHeaders,
          },
        ]
    },
    webpack(config, {isServer}) {
        const { rules } = config.module;
        // Find the array of "style rules" in the webpack config.
        // This is the array of webpack rules that:
        // - is inside a 'oneOf' block
        // - contains a rule that matches 'file.css'
        const styleRules = (rules.find((m) => m.oneOf && m.oneOf.find(({ test: reg }) => reg.test('file.css'))) || {}).oneOf;
        if (!styleRules) return config;
        // Find all the webpack rules that handle CSS modules
        // Look for rules that match '.module.css' and '.module.scss' but aren't being used to generate
        // error messages.
        const cssModuleRules = [
            styleRules.find(({ test: reg, use }) => reg.test('file.module.css') && use.loader !== 'error-loader'),
            styleRules.find(({ test: reg, use }) => reg.test('file.module.scss') && use.loader !== 'error-loader'),
        ].filter((n) => n); // remove 'undefined' values
        // Add the 'localsConvention' config option to the CSS loader config in each of these rules.
        cssModuleRules.forEach((cmr) => {
            // Find the item inside the 'use' list that defines css-loader
            const cssLoaderConfig = cmr.use.find(({ loader }) => loader.includes('css-loader'));
            if (cssLoaderConfig && cssLoaderConfig.options && cssLoaderConfig.options.modules) {
                // Patch it with the new config
                cssLoaderConfig.options.modules.exportLocalsConvention = 'camelCase';
            }
        });
        return config;
    },
    resolve: {
        extensions: [".js", ".json", ".ts", ".tsx"],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@containers': path.resolve(__dirname, 'src/containers'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@constants': path.resolve(__dirname, 'src/constants'),
            '@api': path.resolve(__dirname, 'src/api'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@layouts': path.resolve(__dirname, 'src/layouts'),
            '@context': path.resolve(__dirname, 'src/context'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@store': path.resolve(__dirname, 'src/store'),
            '@actions': path.resolve(__dirname, 'src/store/actions'),
            '@reducers': path.resolve(__dirname, 'src/store/reducers'),
            '@selectors': path.resolve(__dirname, 'src/store/selectors'),
            '@types': path.resolve(__dirname, 'src/types'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@api': path.resolve(__dirname, 'src/api')
        }
    },
})