const db = require("./db/data")

console.log("original data: \n", db)
/* 
output:
 original data: 
 [
  { id: 1, firstName: 'Agus', lastName: 'Saputra', age: 24 },
  { id: 2, firstName: 'Arman', lastName: 'Maulana', age: 50 },
  { id: 3, firstName: 'Raisa', lastName: 'Adriana', age: 31 },
  { id: 4, firstName: 'Isyana', lastName: 'Sarasvati', age: 28 },
  { id: 5, firstName: 'Nazril', lastName: 'Irham', age: 40 }
]
 */

// function to find data in object array
const findData = (id) => {
    // in this function you have to find data in data provided with id from param
    // if the data doesn't exist then just print data not found
    try {
        const data = db;
        const record = data.find((item) => item.id === parseInt(id));
        const obj = new Object
        obj.record = record
        if (!obj.record) {
            obj.msg = `Record with id ${id} NOT found.`
        } else {
            obj.msg = `Record with id ${id} found!`
        }
        console.log(obj.msg, obj.record)
        return obj;
    } catch (err) {
        console.log(err.message)
    }
    // ==== INPUT =====
    // overall sudah bagus , hanya saja dengan case simple seperti ini 
    // bisa diselesaikan dengan perulangan biasa atau dengan langsung pada 1 built in function
    // perlu diinget banyaknya deklarasi variabel baru akan menambah memory yang digunakan
}

// function to update data in object array base on param id
const updateData = (id, newData) => {
    // in this function 
    // you have to update data with the appropriate id of param
    // the second param should be object with the same structure with db from data.js
    /*
    {
        id: 1,
        firstName: "Agus",
        lastName: "Saputra",
        age: 24
    }
    */
    // if the second param(newData) is not object then just print "the second parameter must be object"
    // if the second parameter does not have any of the appropriate properties(firstName,lastName,age) then
    // just print "the object structure in the second parameter does not match with db in data.js"
    // if the data doesn't exist then just print data not found
    const obj = findData(id);
    // const obj = new Object
    // obj.record = record
    if (!obj.record) {
        obj.msg = `Record with id ${id} NOT updated.`
    } else if (typeof newData !== 'object') {
        obj.msg = `Record with id ${id} NOT updated. The second parameter must be object.`
        obj.record = undefined
    } else if (!newData.hasOwnProperty('firstName') || !newData.hasOwnProperty('lastName') || !newData.hasOwnProperty('age')) {
        obj.msg = `Record with id ${id} NOT updated. The object structure in the second parameter does not match with db in data.js.`
        obj.record = undefined
    } else {
        Object.assign(obj.record, newData)
        obj.msg = `Record with id ${id} was updated!`
    }
    console.log(obj.msg)
    return obj;
    // logic yang digunakan sudah benar
    // dan ditambahkan dengan pemanfaatan fungsi findData

}

const deleteData = (id) => {
    // in this function
    // you have to delete data with the appropriate id of param
    // if the data doesn't exist then just print data not found

    const obj = findData(id);
    if (!obj.record) {
        // obj.msg = `Record with id ${id} NOT deleted...`
        // console.log(obj.msg)
        // ======== PESAN ============
        // apa action pada kondisi ini  ?
    } else {
        const index = db.indexOf(obj.record);
        db.splice(index, 1);
        obj.msg = `Record with id ${id} was deleted.`
        console.log('Current database after deletion:', db)
        // ======== PESAN ============
        // sudah bagus dalam penggunaan built in function
        // mungkin bisa di explore built in function yang lain untuk case seperti ini
        // dan kalau bisa dipahami apa yang terjadi di built in function yang digunakan
    }

    return obj.data = db
}

console.log('---- TEST FIND DATA')
findData(1)
/* expected output :
                   data with id 1 found: 
                       { id: 1, firstName: 'Agus', lastName: 'Saputra', age: 24 }
               */

findData(9) // expected output : data with id 9 not found

console.log('\n---- TEST UPDATE DATA')
updateData(1, {
    firstName: "Agus",
    lastName: "Ntoi",
    age: 30
}) /* expected output :
        data with id 1 was updated
        new data: 
        [
        { id: 1, firstName: 'Agus', lastName: 'Ntoi', age: 30 },
        { id: 2, firstName: 'Arman', lastName: 'Maulana', age: 50 },
        { id: 3, firstName: 'Raisa', lastName: 'Adriana', age: 31 },
        { id: 4, firstName: 'Isyana', lastName: 'Sarasvati', age: 28 },
        { id: 5, firstName: 'Nazril', lastName: 'Irham', age: 40 }
        ]
    */
updateData(2, {
    lastName: "Ntoi",
    age: 30
}) // expected output : the object structure in the second parameter does not match with db in data.js

updateData(2, "string") // expected output : the second parameter must be object

updateData(9, {
    firstName: "Agus",
    lastName: "Ntoi",
    age: 30
}) // expected output: data with id 9 not found


console.log('\n---- TEST DELETE DATA')
deleteData(1) /* expected output :
                    data with id 1 was deleted
                    new data: 
                    [
                    { id: 2, firstName: 'Arman', lastName: 'Maulana', age: 50 },
                    { id: 3, firstName: 'Raisa', lastName: 'Adriana', age: 31 },
                    { id: 4, firstName: 'Isyana', lastName: 'Sarasvati', age: 28 },
                    { id: 5, firstName: 'Nazril', lastName: 'Irham', age: 40 }
                    ]
                */

deleteData(10) // expected output : data with id 10 not found

module.exports = {
    findData,
    // addData,
    updateData,
    deleteData
}