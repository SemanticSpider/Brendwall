// Добавляем обработчик на кнопку добавления товара
let add_button = document.querySelector(".add_product_button");
let table = document.querySelector(".products_table")
add_button.addEventListener("click", addProduct)

// Получение списка товаров
async function getProducts(title=false) {
    let productsFetch = await fetch("add-product/", {
            method: "GET",
            headers: {
                "accept": "application/json"
            },
        }
    )
    return productsFetch.json().then((products) => {
        if (title) {
            let newProduct = undefined
            for (let product of products.data.all_products) {
                if (product["title"] == title) {
                    newProduct = product
                }
            }
            if (newProduct != undefined) return newProduct
            else alert("Ошибка при добавлении товара...")
        } else {
            return products
        }
    })
}

// Добавление товара
async function addProduct(){
    let input_value = get_form_info("title", "descr", "price")
    if (input_value.price.match(/^(?:\d+)$/) && input_value.title.length != 0) {
        let push_result = push_info(input_value)
    } else {
        alert("Введены неверные данные")
    }
}

// Добавление товара в таблицу
async function push_info(input_values) {
    let response = fetch("add-product/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "X-CSRFToken": getCSRF()
        },
        body: JSON.stringify(input_values)
    })

    response.then(async (resp) => {
        let products = (await getProducts()).data.all_products
        let prevProduct, newProduct = undefined
        for (let index in products) {
            let product = products[index]
            if (product.title == input_values.title && product.descr == input_values.descr && product.price == input_values.price) {
                prevProduct = index == 0 ? product : products[index - 1]
                newProduct = product
            }
        }
                
        let prevTr = undefined
        if (prevProduct != newProduct) {
            prevTr = [...table.rows].slice(1).find((tr, index) => {
                let tds = tr.querySelectorAll("td")
                if (tds[0].innerHTML == prevProduct["title"] && tds[1].innerHTML == prevProduct["descr"] && tds[2].innerHTML == prevProduct["price"]) return true
            })
        }

        let tdNames = ["title", "descr", "price"]
        let tds = {}
        let tr = document.createElement("tr")
        for (let tdName of tdNames) {
            tds[tdName] = document.createElement("td")
            tds[tdName].innerHTML = newProduct[tdName]
            tr.append(tds[tdName])
        }

        if (prevTr != undefined) {
            prevTr.after(tr)
        } else {
            table.prepend(tr)
        }
        return resp.json()
    })
}

// Получение информации из формы
function get_form_info(...form_input){
    let input_value = {}
    for (let input_name of form_input) {
        input_value[input_name] = document.querySelector(`#${input_name}`).value
    }
    return input_value
}

// Получение CSRF-токена для корректной отправки POST запроса на добавление товара
function getCSRF() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            if (cookie.startsWith("csrftoken"))
                cookieValue = decodeURIComponent(cookie.substring("csrftoken".length + 1))
                break;
        }
    }
    return cookieValue;
}
