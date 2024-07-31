import puppeteer, { Browser } from 'puppeteer'
import { minify } from 'html-minifier'
import { invoices } from './data/invoices'
import path from 'path'
import fs from 'fs'

const templatePath = path.resolve(__dirname, '../src/templates/invoice.html')
const logoPath = path.resolve(__dirname, '../src/assets/logo.png')
const outputDir = path.resolve(__dirname, '../output')

// WE MAKE SURE OUTPUT DIR IS CREATED
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

async function generateInvoices() {
  let browser: Browser | null = null

  try {
    const templateContent = fs.readFileSync(templatePath, { encoding: 'utf-8' })

    const logoContent = fs.readFileSync(logoPath, { encoding: 'base64' })

    const minfiedHTML = minify(templateContent, {
      collapseWhitespace: true,
      minifyCSS: true,
      removeComments: true
    })

    browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true
    })

    for (const invoice of invoices) {
      const invoiceItemsTable = invoice.items
        .map((item, index) => {
          return `<tr>
                <td>${index + 1}</td>
                <td>${item.title}</td>
                <td>${item.price} ${invoice.currency}</td>
                <td>${item.quantity}</td>
                <td>${item.price * item.quantity} ${invoice.currency}</td>
            </tr>`
        })
        .join('')

      const htmlWithInvoiceData = minfiedHTML
        .replace(/{{INVOICE_ID}}/gi, invoice.id)
        .replace(
          /{{INVOICE_CREATED_AT}}/gi,
          invoice.createdAt.toLocaleDateString('pl-PL')
        )
        .replace(
          /{{INVOICE_DUE_DATE}}/gi,
          invoice.dueDate.toLocaleDateString('pl-PL')
        )
        .replace(/{{CURRENCY}}/gi, invoice.currency)
        .replace(
          /{{SELLER_BANK_ACCOUNT}}/gi,
          invoice.billing.seller.bankAccountNr
        )
        .replace(/{{SELLER_NAME}}/gi, invoice.billing.seller.name)
        .replace(/{{SELLER_ADDRESS}}/gi, invoice.billing.seller.address)
        .replace(/{{SELLER_ZIP}}/gi, invoice.billing.seller.zip)
        .replace(/{{SELLER_CITY}}/gi, invoice.billing.seller.city)
        .replace(/{{SELLER_TAX_ID}}/gi, invoice.billing.seller.tax_id)
        .replace(/{{SELLER_PHONE}}/gi, invoice.billing.seller.phone || '')
        .replace(/{{SELLER_EMAIL}}/gi, invoice.billing.seller.email || '')
        .replace(/{{BUYER_NAME}}/gi, invoice.billing.buyer.name)
        .replace(/{{BUYER_ADDRESS}}/gi, invoice.billing.buyer.address)
        .replace(/{{BUYER_ZIP}}/gi, invoice.billing.buyer.zip)
        .replace(/{{BUYER_CITY}}/gi, invoice.billing.buyer.city)
        .replace(/{{BUYER_PHONE}}/gi, invoice.billing.buyer.phone || '')
        .replace(/{{BUYER_EMAIL}}/gi, invoice.billing.buyer.email || '')
        .replace(/{{LOGO_URL}}/gi, `data:image/png;base64, ${logoContent}`)
        .replace(
          /{{TOTAL_PRICE}}/,
          invoice.items
            .reduce((acc, item) => acc + item.price * item.quantity, 0)
            .toString()
        )
        .replace(/{{INVOICE_ITEMS_TABLE}}/gi, invoiceItemsTable)

      const page = await browser.newPage()
      await page.setContent(htmlWithInvoiceData)

      const buffer = await page.pdf({
        format: 'A4',
        margin: {
          left: '10mm',
          right: '10mm',
          top: '10mm',
          bottom: '10mm'
        }
      })

      const invoiceOutputPath = path.resolve(
        outputDir,
        `invoice_${invoice.id}.pdf`
      )

      fs.writeFileSync(invoiceOutputPath, buffer)

      await page.close()
    }

    browser.close()
  } catch (error) {
    console.error(error)
    browser?.close()
  }
}

generateInvoices()
