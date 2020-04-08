"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NegociacaoController = function () {
  function NegociacaoController() {
    _classCallCheck(this, NegociacaoController);

    var $ = document.querySelector.bind(document);
    this._inputData = $("#data");
    this._inputQuantidade = $("#quantidade");
    this._inputValor = $("#valor");
    this._ordemAtual = "";

    this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($("#negociacoesView")), "adiciona", "esvazia", "ordena", "inverteOrdem");

    this._mensagem = new Bind(new Mensagem(), new MensagemView($("#mensagemView")), "texto");

    this._service = new NegociacaoService();

    this._init();
  }

  _createClass(NegociacaoController, [{
    key: "_init",
    value: async function _init() {
      var _this = this;

      try {
        var negociacoes = await this._service.lista();
        negociacoes.forEach(function (negociacao) {
          return _this._listaNegociacoes.adiciona(negociacao);
        });
      } catch (erro) {
        this._mensagem.texto = erro;
      }

      setInterval(function () {
        _this.importarNegociacoes();
      }, 3000);
    }
  }, {
    key: "adiciona",
    value: async function adiciona(event) {
      event.preventDefault();

      try {
        var negociacao = this._criaNegociacao();
        var mensagem = await this._service.cadastra(negociacao);
        this._listaNegociacoes.adiciona(negociacao);
        this._mensagem.texto = mensagem;
        this._limpaFormulario();
      } catch (erro) {
        this._mensagem.texto = erro;
      }
    }
  }, {
    key: "apaga",
    value: async function apaga() {
      try {
        var mensagem = await this._service.apaga();
        this._mensagem.texto = mensagem;
        this._listaNegociacoes.esvazia();
      } catch (erro) {
        this._mensagem.texto = erro;
      }
    }
  }, {
    key: "importarNegociacoes",
    value: async function importarNegociacoes() {
      var _this2 = this;

      try {
        var negociacoes = await this._service.importa(this._listaNegociacoes.negociacoes);
        negociacoes.forEach(function (negociacao) {
          return _this2._listaNegociacoes.adiciona(negociacao);
        });

        this._mensagem.texto = "Negociações do período importadas com sucesso";
      } catch (erro) {
        this._mensagem.texto = erro;
      }
    }
  }, {
    key: "ordena",
    value: function ordena(coluna) {
      if (this._ordemAtual == coluna) {
        this._listaNegociacoes.inverteOrdem();
        this._ordemAtual = "";
      } else {
        this._listaNegociacoes.ordena(function (a, b) {
          return a[coluna] - b[coluna];
        });
        this._ordemAtual = coluna;
      }
    }
  }, {
    key: "_limpaFormulario",
    value: function _limpaFormulario() {
      this._inputData.value = "";
      this._inputQuantidade.value = 1;
      this._inputValor.value = 0;

      this._inputData.focus();
    }
  }, {
    key: "_criaNegociacao",
    value: function _criaNegociacao() {
      return new Negociacao(DateHelper.textoParaData(this._inputData.value), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
    }
  }]);

  return NegociacaoController;
}();
//# sourceMappingURL=NegociacaoController.js.map