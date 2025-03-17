const puppeteer = require("puppeteer")
const fs = require("fs")

const scrape = async () => {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    let data = []
    let pageNumber = 1
    while (pageNumber <= 10) {
        const url = `https://books.toscrape.com/catalogue/page-${pageNumber}.html`

        await page.goto(url)

      const books = await page.evaluate(() => {
        const cardElement = document.querySelectorAll('.product_pod')
        return Array.from(cardElement).map((book) => {
            const title = book.querySelector("h3 a").getAttribute("title")
            const price = book.querySelector(".product_price .price_color").textContent
            const img = book.querySelector(".image_container .thumbnail").getAttribute("src")
            const inStock = book.querySelector(".instock.availability") ? "In Stock" : "Out of Stock" 
            return {
                title,
                price,
                img,
                inStock
            }
        })
        
    })
            data.push(books)
            pageNumber++
    }
    

    fs.writeFileSync("books.json" , JSON.stringify(data, null , 2))
    await browser.close()
}

scrape()