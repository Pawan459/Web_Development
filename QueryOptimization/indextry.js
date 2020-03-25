const eleSideNav = document.getElementById('sideNav')
const eleTableData = document.getElementById('tableData')

// checking pull request through git desktop

let originalData = [], currentData = [], filterKeys = []

let lastIndex = 0, maxIndex = undefined, limit = 15, tableIndex = 0, rowIndex = 0
let dataFilteration = {}, allFilter = {}, rowKeys = {}, allRows = {}, appliedFilter = {}

const unionOperation = (firstArray, secondArray) => {
    // return the union of two arrays
    return [...new Set([...firstArray, ...secondArray])]
}

const intersectionOperation = (firstArray, secondArray) => {
    //  return the intersection of two arrays
    return firstArray.filter(value => secondArray.includes(value))
}

const applyKeyWiseFilter = (superRowSet, filterValue, keyIndex) => {
    // Get all the data members from the superset which have that filter value
    let arr = []
    Object.values(superRowSet).forEach(row => {
        let col = [...row.cells]
        if (checkStringOccurence(col[keyIndex].innerText, filterValue)) arr.push(row)
    })
    return arr
}

const insertRow = (rowData, tableBodyId) => {
    // insert row in the in specified table body

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
    // Check whether the string value occurs in the given array or not 
    for(let i = 0; i< arr.length;i++){
        if(arr[i] == value) return true
    }
    return false
}

const checkFilters = (rowData)=>{
    // Only called on infinite scroll event
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

    // Logic is just to get all the filter types filter then intersect it
    // For example -> 
    //      Filter Type -> filters
    //      accountName -> Savings Account U Checkings Account
    //      transactionType -> deposit U payment
    //      result -> accountName intersection transactionType
    let prev = currentData, arr = currentData
    let keys = Object.keys(appliedFilter)
    for(let i = 0; i< keys.length;i++){
        arr = applyKeyWiseFilter(allRows, appliedFilter[keys[i]], keys[i])
        if (i == 0) {
            prev = arr
        }
        else {
            arr = unionOperation(arr, applyKeyWiseFilter(allRows, appliedFilter[keys[i]], keys[i]))
            // If we get empty array then we don't have to alter the data
            // previous state of data is the reuquired state
            if(arr.length == 0) continue
            prev = intersectionOperation(arr, prev)
        }
    }
    // Updating Our Current Data
    currentData = prev

    // Updating all the Available Rows Based On the Current Data
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
    // Filter our current data so that it doesn't contains any irrelevant value
    try {
        currentData = currentData.filter(value => !value.classList.contains('hideRow'))
    } catch (error) {
        
    }
    
    // Checking if the current data length is 
    // sufficient to fit in the screen or not to get a scroll bar
    if (currentData.length < 15 && currentData.length>0) {
        console.log(currentData.length)
        processData(originalData)
        return
    }
    return
}

const updateTableHeadings = (tableHeading, tableHeadId, rowValue) => {
    // Update the table headings of the specified table head
    let tableHead = document.getElementById(tableHeadId)

    let th = document.createElement('th')
    th.innerHTML = tableHeading
    tableHead.appendChild(th)

    rowKeys[rowValue] = rowIndex++
}

const updateSideNav = (filterType, data) => {
    // Check if that filter is permitted to have filteration or not.
    if(!dataFilteration[filterType]){
        dataFilteration[filterType] = true

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
    if(allFilter[data[filterType]]) return

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

    allFilter[data[filterType]] = true
}

const updateFiters = (filterKeys) => {
    filterKeys.forEach(element => {
        dataFilteration[element] = false
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
