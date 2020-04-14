"use strict";

System.register(["./HttpService", "./ConnectionFactory", "../dao/NegociacaoDao", "../models/Negociacao"], function (_export, _context) {
  "use strict";

  var HttpService, ConnectionFactory, NegociacaoDao, Negociacao, _createClass, NegociacaoService;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_HttpService) {
      HttpService = _HttpService.HttpService;
    }, function (_ConnectionFactory) {
      ConnectionFactory = _ConnectionFactory.ConnectionFactory;
    }, function (_daoNegociacaoDao) {
      NegociacaoDao = _daoNegociacaoDao.NegociacaoDao;
    }, function (_modelsNegociacao) {
      Negociacao = _modelsNegociacao.Negociacao;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export("NegociacaoService", NegociacaoService = function () {
        function NegociacaoService() {
          _classCallCheck(this, NegociacaoService);

          this._http = new HttpService();
        }

        _createClass(NegociacaoService, [{
          key: "obterNegociacoesDaSemana",
          value: function obterNegociacoesDaSemana() {
            return this._http.get("/negociacoes/semana").then(function (negociacoes) {
              return negociacoes.map(function (objeto) {
                return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
              });
            }).catch(function (erro) {
              throw new Error("Não foi possível obter as negociações da semana");
            });
          }
        }, {
          key: "obterNegociacoesDaSemanaAnterior",
          value: function obterNegociacoesDaSemanaAnterior() {
            return this._http.get("/negociacoes/anterior").then(function (negociacoes) {
              return negociacoes.map(function (objeto) {
                return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
              });
            }).catch(function (erro) {
              throw new Error("Não foi possível obter as negociações da semana anterior");
            });
          }
        }, {
          key: "obterNegociacoesDaSemanaRetrasada",
          value: function obterNegociacoesDaSemanaRetrasada() {
            return this._http.get("/negociacoes/retrasada").then(function (negociacoes) {
              return negociacoes.map(function (objeto) {
                return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
              });
            }).catch(function (erro) {
              throw new Error("Não foi possível obter as negociações da semana retrasada");
            });
          }
        }, {
          key: "obterNegociacoes",
          value: function obterNegociacoes() {
            return Promise.all([this.obterNegociacoesDaSemana(), this.obterNegociacoesDaSemanaAnterior(), this.obterNegociacoesDaSemanaRetrasada()]).then(function (periodos) {
              var negociacoes = periodos.reduce(function (dados, periodo) {
                return dados.concat(periodo);
              }, []);

              return negociacoes;
            }).catch(function (erro) {
              throw new Error(erro);
            });
          }
        }, {
          key: "cadastra",
          value: async function cadastra(negociacao) {
            try {
              var conexao = await ConnectionFactory.getConnection();
              await new NegociacaoDao(conexao).adiciona(negociacao);
              return "Negociação adicionada com sucesso";
            } catch (erro) {
              throw new Error("Não foi possível adicionar a negociação");
            }
          }
        }, {
          key: "lista",
          value: async function lista() {
            try {
              var connection = await ConnectionFactory.getConnection();
              var dao = new NegociacaoDao(connection);
              var negociacoes = await dao.listaTodos();
              return negociacoes;
            } catch (erro) {
              throw new Error("Não foi possível obter as negociações");
            }
          }
        }, {
          key: "apaga",
          value: async function apaga() {
            var connection = await ConnectionFactory.getConnection();
            var dao = new NegociacaoDao(connection);
            return await dao.apagaTodos();
          }
        }, {
          key: "importa",
          value: async function importa(listaAtual) {
            try {
              var negociacoes = await this.obterNegociacoes();
              return negociacoes.filter(function (negociacao) {
                return !listaAtual.some(function (negociacaoExistente) {
                  return negociacao.isEquals(negociacaoExistente);
                });
              });
            } catch (erro) {
              throw new Error("Não foi possível importar as negociações");
            }
          }
        }]);

        return NegociacaoService;
      }());

      _export("NegociacaoService", NegociacaoService);
    }
  };
});
//# sourceMappingURL=NegociacaoService.js.map