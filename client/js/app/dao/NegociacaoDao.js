class NegociacaoDao {

    constructor(connection) {
        this._connection = connection
        this._store = 'negociacoes'
    }

    async adiciona(negociacao) {
        
        let request = this._connection
            .transaction([this._store], 'readwrite')
            .objectStore(this._store)
            .add(negociacao)


        request.onsuccess = () => {
            return
        }

        request.onerror = e => {
            throw new Error('Não foi possível adicionar a negociação')
        }          
    }
}