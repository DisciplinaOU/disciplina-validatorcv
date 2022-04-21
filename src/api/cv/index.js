import { gql } from '@apollo/client';
import { GraphQLClient } from '../../Modules/GraphQL';
import HttpService from '../../Modules/Http';
import { CheckCVResponse, GetBlockInfoByTxIdResponse } from './types.js';

const checkCV = (file: File): Promise<CheckCVResponse> => (
  HttpService.put(
    '/checkcv-pdf',
    file,
    {
      headers:
      {
        'Content-Type': 'application/pdf',
      }
    })
)

const getBlockInfoByTxId = (tdId: string): GetBlockInfoByTxIdResponse => (
  GraphQLClient.query({
    query: gql`
      query PrivateBlockHeader {
        privateBlockHeader(id: "${tdId}") {
          merkleRoot
        }
      }
    `
  }).then(response => response.data)
)

export const CVApi = { checkCV, getBlockInfoByTxId }