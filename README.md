# Generating PDF files with NodeJS and puppeteer

How to generate PDF documents in NodeJS environment? I use puppeteer for that. In this example I generate PDF files, from the array of invoices data.

## Installing required packages

```properties
npm i puppeteer html-minifier
npm i –save-dev typescript @types/html-minifier
npx -p typescript tsc –init
```

## vscode settings.json

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  }
}
```

## .prettierrc config

Example of basic prettier setup.

```json
{
  "trailingComma": "none",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true
}
```

## Support

This is my youtube [channel](https://www.youtube.com/channel/UCCBoahZ21JQ3wClmEeWqzUg).
Let me know if you liked this example.
