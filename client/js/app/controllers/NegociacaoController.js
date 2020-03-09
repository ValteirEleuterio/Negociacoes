class NegociacaoController{

    constructor(){
        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._ordemAtual = '';

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 
            'esvazia',
            'ordena',
            'inverteOrdem'
        );
     
        this._mensagem =  new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto'
        );

        try {
            this._buscaNegociacoesDoBanco();
        } catch(erro) {
            this._mensagem.texto = erro;
        }        
    }

    async _buscaNegociacoesDoBanco() {
        let connection = await ConnectionFactory.getConnection();
        let dao = new NegociacaoDao(connection);
        let negociacoes = await dao.listaTodos();
        negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
    }

    async adiciona(event){
        event.preventDefault();

        try {
            let conexao = await ConnectionFactory.getConnection();
            let negociacao = this._criaNegociacao();
            await new NegociacaoDao(conexao)
                .adiciona(negociacao)

                this._listaNegociacoes.adiciona(this._criaNegociacao());
                this._mensagem.texto = 'Negociação adicionada com sucesso';
                this._limpaFormulario();  
        } catch (erro) {
            this._mensagem.texto = erro;
        }     
    }

    async apaga(){
        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            });
    }

    importarNegociacoes(){

        let service = new NegociacaoService();

        service
        .obterNegociacoes()
        .then(negociacoes => {
          negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
          this._mensagem.texto = 'Negociações do período importadas com sucesso';
        })
        .catch(error => this._mensagem.texto = error); 
    }

    ordena(coluna){

        if(this._ordemAtual == coluna){
            this._listaNegociacoes.inverteOrdem();
            this._ordemAtual = '';
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
            this._ordemAtual = coluna;   
        }
    }

    _limpaFormulario(){
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0;

        this._inputData.focus();
    }

    _criaNegociacao(){

        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }
}