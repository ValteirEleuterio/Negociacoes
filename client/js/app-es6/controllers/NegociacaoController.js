import { ListaNegociacoes } from "../models/ListaNegociacoes";
import { Mensagem } from "../models/Mensagem";
import { NegociacoesView } from "../views/NegociacoesView";
import { MensagemView } from "../views/MensagemView";
import { NegociacaoService } from "../services/NegociacaoService";
import { DateHelper } from "../helpers/DateHelper";
import { Bind } from "../helpers/Bind";
import { Negociacao } from "../models/Negociacao";

class NegociacaoController {
  constructor() {
    let $ = document.querySelector.bind(document);
    this._inputData = $("#data");
    this._inputQuantidade = $("#quantidade");
    this._inputValor = $("#valor");
    this._ordemAtual = "";

    this._listaNegociacoes = new Bind(
      new ListaNegociacoes(),
      new NegociacoesView($("#negociacoesView")),
      "adiciona",
      "esvazia",
      "ordena",
      "inverteOrdem"
    );

    this._mensagem = new Bind(
      new Mensagem(),
      new MensagemView($("#mensagemView")),
      "texto"
    );

    this._service = new NegociacaoService();

    this._init();
  }

  async _init() {
    try {
      let negociacoes = await this._service.lista();
      negociacoes.forEach((negociacao) =>
        this._listaNegociacoes.adiciona(negociacao)
      );
    } catch (erro) {
      this._mensagem.texto = erro;
    }

    setInterval(() => {
      this.importarNegociacoes();
    }, 3000);
  }

  async adiciona(event) {
    event.preventDefault();

    try {
      let negociacao = this._criaNegociacao();
      let mensagem = await this._service.cadastra(negociacao);
      this._listaNegociacoes.adiciona(negociacao);
      this._mensagem.texto = mensagem;
      this._limpaFormulario();
    } catch (erro) {
      this._mensagem.texto = erro;
    }
  }

  async apaga() {
    try {
      let mensagem = await this._service.apaga();
      this._mensagem.texto = mensagem;
      this._listaNegociacoes.esvazia();
    } catch (erro) {
      this._mensagem.texto = erro;
    }
  }

  async importarNegociacoes() {
    try {
      let negociacoes = await this._service.importa(
        this._listaNegociacoes.negociacoes
      );
      negociacoes.forEach((negociacao) =>
        this._listaNegociacoes.adiciona(negociacao)
      );

      this._mensagem.texto = "Negociações do período importadas com sucesso";
    } catch (erro) {
      this._mensagem.texto = erro;
    }
  }

  ordena(coluna) {
    if (this._ordemAtual == coluna) {
      this._listaNegociacoes.inverteOrdem();
      this._ordemAtual = "";
    } else {
      this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
      this._ordemAtual = coluna;
    }
  }

  _limpaFormulario() {
    this._inputData.value = "";
    this._inputQuantidade.value = 1;
    this._inputValor.value = 0;

    this._inputData.focus();
  }

  _criaNegociacao() {
    return new Negociacao(
      DateHelper.textoParaData(this._inputData.value),
      parseInt(this._inputQuantidade.value),
      parseFloat(this._inputValor.value)
    );
  }
}

let negociacaoController = new NegociacaoController();
export function currentInstance() {
  return negociacaoController;
}
