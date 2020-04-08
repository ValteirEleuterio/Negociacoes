class NegociacaoService {
  constructor() {
    this._http = new HttpService();
  }

  obterNegociacoesDaSemana() {
    return this._http
      .get("/negociacoes/semana")
      .then((negociacoes) => {
        return negociacoes.map(
          (objeto) =>
            new Negociacao(
              new Date(objeto.data),
              objeto.quantidade,
              objeto.valor
            )
        );
      })
      .catch((erro) => {
        console.log(erro);
        throw new Error("Não foi possível obter as negociações da semana");
      });
  }

  obterNegociacoesDaSemanaAnterior() {
    return this._http
      .get("/negociacoes/anterior")
      .then((negociacoes) => {
        return negociacoes.map(
          (objeto) =>
            new Negociacao(
              new Date(objeto.data),
              objeto.quantidade,
              objeto.valor
            )
        );
      })
      .catch((erro) => {
        console.log(erro);
        throw new Error(
          "Não foi possível obter as negociações da semana anterior"
        );
      });
  }

  obterNegociacoesDaSemanaRetrasada() {
    return this._http
      .get("/negociacoes/retrasada")
      .then((negociacoes) => {
        return negociacoes.map(
          (objeto) =>
            new Negociacao(
              new Date(objeto.data),
              objeto.quantidade,
              objeto.valor
            )
        );
      })
      .catch((erro) => {
        console.log(erro);
        throw new Error(
          "Não foi possível obter as negociações da semana retrasada"
        );
      });
  }

  obterNegociacoes() {
    return Promise.all([
      this.obterNegociacoesDaSemana(),
      this.obterNegociacoesDaSemanaAnterior(),
      this.obterNegociacoesDaSemanaRetrasada(),
    ])
      .then((periodos) => {
        let negociacoes = periodos.reduce(
          (dados, periodo) => dados.concat(periodo),
          []
        );

        return negociacoes;
      })
      .catch((erro) => {
        throw new Error(erro);
      });
  }

  async cadastra(negociacao) {
    try {
      let conexao = await ConnectionFactory.getConnection();
      await new NegociacaoDao(conexao).adiciona(negociacao);
      return "Negociação adicionada com sucesso";
    } catch (erro) {
      throw new Error("Não foi possível adicionar a negociação");
    }
  }

  async lista() {
    try {
      let connection = await ConnectionFactory.getConnection();
      let dao = new NegociacaoDao(connection);
      let negociacoes = await dao.listaTodos();
      return negociacoes;
    } catch (erro) {
      console.log(erro);
      throw new Error("Não foi possível obter as negociações");
    }
  }

  async apaga() {
    let connection = await ConnectionFactory.getConnection();
    let dao = new NegociacaoDao(connection);
    return await dao.apagaTodos();
  }

  async importa(listaAtual) {
    try {
      let negociacoes = await this.obterNegociacoes();
      return negociacoes.filter(
        (negociacao) =>
          !listaAtual.some((negociacaoExistente) =>
            negociacao.isEquals(negociacaoExistente)
          )
      );
    } catch (erro) {
      console.log(erro);
      throw new Error("Não foi possível importar as negociações");
    }
  }
}
