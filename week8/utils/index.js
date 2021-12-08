// helper function to check empty query object
// exports.isEmptyObject(obj) {
//     for (var prop in obj) {
//         if (Object.prototype.hasOwnProperty.call(obj, prop)) {
//             return false;
//         }
//     }
//     return true;
// }

exports.isEmptyObject = (obj) => {
    for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
}
