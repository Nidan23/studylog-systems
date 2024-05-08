import axios from 'axios'
import fs from 'fs'

const filePath = './products.json'
const url = 'https://www.example.com/api/products'

const maxNumberOfProducts = 1000

const maxAllowedPrice = maxAllowedPrice
const priceStepUp = 1000
const priceStepDown = 50

async function run() {
    const allProducts = []
    const price = {
        min: 0,
        max: 1000
    }

    while(price.max <= maxAllowedPrice) {
        const products = await getProducts(price)
        allProducts.push(products.products)

        if(products.hasReachedMaxPrice) {
            break
        }

        price.min = products.minPrice
        price.max = products.maxPrice
    }

    saveToFile(allProducts, filePath)
}

async function getProducts(prices) {
    let resultValues = {
        count: 0,
        products: [],
        minPrice: prices.min,
        maxPrice: prices.max,
        hasReachedMaxPrice: false
    }

    let response = await axios.get(url, {
        params: {
            minPrice: prices.min,
            maxPrice: prices.max
        }
    })
    let responseBody = response.data

    if(parseInt(response.data['count']) === maxNumberOfProducts){
        resultValues.maxPrice -= priceStepDown
    } else {
        resultValues.products.push(response.data.products)

        resultValues.minPrice = prices.max

        if((resultValues.maxPrice + priceStepUp) > maxAllowedPrice) {
            resultValues.maxPrice += maxAllowedPrice - resultValues.maxPrice
        }
        else {
            resultValues.maxPrice += priceStepUp
        }
    }

    resultValues.count = responseBody.count
    resultValues.hasReachedMaxPrice = resultValues.maxPrice >= maxAllowedPrice

    return resultValues
}

function saveToFile(allProducts, filePath) {
    if(!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, allProducts)
    } else {
        fs.appendFileSync(allProducts, filePath)
    }
}

run()
