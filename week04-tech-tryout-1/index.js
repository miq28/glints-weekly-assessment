function sumOfArray(arr1, arr2) {
    let result = 0
    // the logic 
    // type the code below
    const arr1Length = arr1.length
    const arr2Length = arr2.length

    // compare length of each array
    // add element 0 in array whose length is smaller
    if (arr1Length > arr2Length) {
        arr2.push(0)
    } else if (arr1Length < arr2Length) {
        arr1.push(0)
    }

    // callback function to sum values in one array
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    // calculate sum of all array
    const sum = arr1.reduce(reducer) + arr2.reduce(reducer)

    return sum
}

console.log(sumOfArray([1,2,3,5], [1,2,3])) // expected output : 17
console.log(sumOfArray([1,2,3], [1,2,3,2])) // expected output : 14