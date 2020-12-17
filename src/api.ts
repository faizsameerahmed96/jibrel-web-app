import axios from 'axios'
import config from './config.json'

export default class {
    static async getTokenTxns(contractAddress, walletAddress, page = 0) {
        try {
            return (await axios.get(`${config.apiUrl}/token/${contractAddress}/logs`, {
                params: {
                    forAddress: walletAddress,
                    page
                }
            })).data
        } catch (err) {
            throw err
        }
    }
}