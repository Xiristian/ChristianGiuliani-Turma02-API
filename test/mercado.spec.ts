import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { fa, faker } from '@faker-js/faker/.';

describe('Mercado', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api-desafio-qa.onrender.com';
  let mercadoId = null;
  let frutaId = null;

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Mercado', () => {
    it('Novo mercado', async () => {
      mercadoId = await p
        .spec()
        .post(`${baseUrl}/mercado`)
        .expectStatus(StatusCodes.CREATED)
        .withBody({
          cnpj: (Math.random() * 100000000000000).toFixed(0),
          endereco: faker.location.street(),
          nome: faker.person.fullName()
        })
        .returns('novoMercado.id');
      expect(typeof mercadoId).toStrictEqual('number');
    });

    it('Editar mercado', async () => {
      mercadoId = await p
        .spec()
        .put(`${baseUrl}/mercado/${mercadoId}`)
        .expectStatus(StatusCodes.OK)
        .withBody({
          cnpj: (Math.random() * 100000000000000).toFixed(0),
          endereco: faker.location.street(),
          nome: faker.person.fullName()
        })
        .returns('updatedMercado.id');
      expect(typeof mercadoId).toStrictEqual('number');
    });

    it('Nova fruta', async () => {
      frutaId = await p
        .spec()
        .post(`${baseUrl}/mercado/${mercadoId}/produtos/hortifruit/frutas`)
        .expectStatus(StatusCodes.CREATED)
        .withBody({
          nome: faker.food.fruit(),
          valor: (Math.random() * 10).toFixed(0)
        })
        .expectJsonSchema({
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            product_item: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer'
                },
                nome: {
                  type: 'string'
                },
                valor: {
                  type: 'string'
                }
              },
              required: ['id', 'nome', 'valor']
            }
          },
          required: ['message', 'product_item']
        })
        .returns('product_item.id');
    });

    it('Deletar fruta', async () => {
      const teste = await p
        .spec()
        .delete(
          `${baseUrl}/mercado/${mercadoId}/produtos/hortifruit/frutas/${frutaId}`
        )
        .expectStatus(StatusCodes.CREATED)
        .withBody({
          nome: faker.food.fruit(),
          valor: (Math.random() * 10).toFixed(0)
        })
        .expectJsonSchema({
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            product_item: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer'
                },
                nome: {
                  type: 'string'
                },
                valor: {
                  type: 'string'
                }
              },
              required: ['id', 'nome', 'valor']
            }
          },
          required: ['message', 'product_item']
        })
        .returns('');
      console.log('Delete', teste);
    });
  });
});
