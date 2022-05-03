/* En vez de hacer try/catch, se puede usar
esta función para envolver el 2do argumento
de las rutas
*/

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}
