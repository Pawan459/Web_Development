const eleSideNav = document.getElementById('sideNav')
const eleTableData = document.getElementById('tableData')

let originalData = [], currentData = []

let lastIndex = 0, maxIndex = undefined, limit = 15, tableIndex = 0, rowIndex = 0
let filterKeys = [], rowKeys = {}, allRows = {}, appliedFilter = {}
let dataFilteration = new Map(), allFilter = new Map()

const unionOperation = (firstArray, secondArray) => {
    return [...new Set([...firstArray, ...secondArray])]
}

const intersectionOperation = (firstArray, secondArray) => {
    return firstArray.filter(value => secondArray.includes(value))
}

const applyKeyWiseFilter = (superRowSet, filterValue, keyIndex) => {
    let arr = []
    Object.values(superRowSet).forEach(row => {
        let col = [...row.cells]
        if (checkStringOccurence(col[keyIndex].innerText, filterValue)) arr.push(row)
    })
    return arr
}

const insertRow = (rowData, tableBodyId) => {

    let tableBody = document.getElementById(tableBodyId)
    let tableRow = document.createElement('tr')

    Object.keys(rowKeys).forEach(element => {
        let tableCol = document.createElement('td')
        if (element == 'account') {
            tableCol.classList.add('underLine')
        }
        tableCol.innerHTML = rowData[element]
        tableRow.appendChild(tableCol)
    })

    allRows[rowData['account']] = tableRow
    tableBody.appendChild(tableRow)

    checkFilters(rowData)
}

const checkStringOccurence = (value, arr) => {
    for(let i = 0; i< arr.length;i++){
        if(arr[i] == value) return true
    }
    return false
}

const checkFilters = (rowData)=>{
    if(rowData){
        let arr = [...allRows[rowData['account']].cells]
        Object.keys(appliedFilter).forEach(key => {
            if(!checkStringOccurence(arr[key].innerText, appliedFilter[key])){
                allRows[rowData['account']].classList.add('hideRow')
            }
            else{
                if(!allRows[rowData['account']].classList.contains('hideRow'))
                    currentData.push(allRows[rowData['account']])
            }
        })
        return
    }
    let prev = currentData, arr = currentData
    let keys = Object.keys(appliedFilter)
    for(let i = 0; i< keys.length;i++){
        arr = applyKeyWiseFilter(allRows, appliedFilter[keys[i]], keys[i])
        if (i == 0) {
            prev = arr
        }
        else {
            arr = unionOperation(arr, applyKeyWiseFilter(allRows, appliedFilter[keys[i]], keys[i]))
            if(arr.length == 0) continue
            prev = intersectionOperation(arr, prev)
        }
    }
    currentData = prev
    Object.values(allRows).forEach(value => {
        if(currentData.includes(value) || currentData.length == 0){
            value.classList.remove('hideRow')
        }
        else{
            value.classList.add('hideRow')
        }
    })
    checkData(currentData)
}

const checkData = (currentData) => {
    try {
        currentData = currentData.filter(value => !value.classList.contains('hideRow'))
    } catch (error) {
        
    }
    
    if (currentData.length < 15 && currentData.length>0) {
        console.log(currentData.length)
        processData(originalData)
        return
    }
    return
}

const updateTableHeadings = (tableHeading, tableHeadId, rowValue) => {
    let tableHead = document.getElementById(tableHeadId)

    let th = document.createElement('th')
    th.innerHTML = tableHeading
    tableHead.appendChild(th)

    rowKeys[rowValue] = rowIndex++
}

const updateSideNav = (filterType, data) => {
    if(!dataFilteration.get(filterType)){
        dataFilteration.set(filterType, true)

        let header = document.createElement('h5')
        header.innerHTML = filterType.toString().toUpperCase()

        let division = document.createElement('div')
        division.className = "checkPoints"
        division.id = filterType

        division.appendChild(header)
        eleSideNav.appendChild(division)

        filterKeys.push(filterType)
        return
    }

    // If we already have that Filter no need To Do Anything
    if(allFilter.has(data[filterType])) return

    let mainDiv = document.getElementById(filterType)

    let textLabel = document.createElement('label')
    textLabel.innerHTML = data[filterType]

    let textInput = document.createElement('input')
    textInput.type = 'checkbox'
    textInput.value = data[filterType]
    textInput.className = filterType
    textInput.addEventListener('change', updateTable)
    textLabel.insertBefore(textInput,textLabel.firstChild)

    mainDiv.appendChild(textLabel)

    allFilter.set(data[filterType], true)
}

const updateFiters = (filterKeys) => {
    filterKeys.forEach(element => {
        dataFilteration.set(element, false)
    });
}

const updateSideFilters = ()=>{
    let start = 0, last = maxIndex
    let interval = setInterval(()=>{
        if (start >= last-1) clearInterval(interval)
        filterKeys.forEach(element => {
            updateSideNav(element, originalData[start])
        })
        start += 1
    },0) 
}

const processData = (currentDataList) => {
    let minLimit = Math.min(lastIndex + limit, maxIndex)
    if (minLimit >= maxIndex) return
    let interval = setInterval(() => {
        if (lastIndex >= minLimit) {
            lastIndex = minLimit
            clearInterval(interval)
            checkData(currentData)
        }
        insertRow(currentDataList[lastIndex], `tableBody0`)
        lastIndex += 1
    }, 0)
}

const getData = () =>{
    fetch('http://127.0.0.1:8080/data/data.json')
        .then(res => res.json())
        .then(data => {
            originalData = data['transactions']
            maxIndex = originalData.length
            // currentData = originalData
            updateFiters(Object.keys(originalData[0]))
            updateSideNav('accountName')
            updateSideNav('transactionType')
            updateSideFilters()
            processData(originalData)
        })
}

const renderTable = () => {
    let mainTable = document.createElement('table')
    mainTable.id = `table${tableIndex}`

    let tableHead = document.createElement('thead')
    tableHead.id = `tableHead${tableIndex}`

    let tableBody = document.createElement('tbody')
    tableBody.id = `tableBody${tableIndex++}`

    mainTable.appendChild(tableHead)
    mainTable.appendChild(tableBody)
    eleTableData.appendChild(mainTable)
}

const renderInit = (event) =>{
    getData()
    renderTable()
    updateTableHeadings('Account Number', `tableHead0`, 'account')
    updateTableHeadings('Account Name', `tableHead0`, 'accountName')
    updateTableHeadings('Currency', `tableHead0`, 'currencyCode')
    updateTableHeadings('Amount', `tableHead0`, 'amount')
    updateTableHeadings('Transaction Type', `tableHead0`, 'transactionType')
}

const infinteScroll = (event) => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement
    if(clientHeight + scrollTop >= scrollHeight){
        processData(originalData)
    }
}

const updateTable = (event) => {
    let value = event.target.value
    let key = event.target.className
    if (event.target.checked == true) {
        if (appliedFilter[rowKeys[key]]) {
            appliedFilter[rowKeys[key]].push(value)
        }
        else {
            appliedFilter[rowKeys[key]] = [value]
        }
    }
    else {
        let arr = appliedFilter[rowKeys[key]]
        if (arr) {
            arr = arr.filter(valueKey => valueKey != value)
            appliedFilter[rowKeys[key]] = arr
        }
    }
    checkFilters()
}

window.addEventListener('load', renderInit)

window.addEventListener('scroll', infinteScroll)