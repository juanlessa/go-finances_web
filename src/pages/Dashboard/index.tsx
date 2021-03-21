import React, { useState, useEffect } from 'react';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
    id: string;
    title: string;
    value: number;
    formattedValue: string;
    formattedDate: string;
    type: 'income' | 'outcome';
    category: { title: string };
    created_at: Date;
    formatedValue: String;
}

interface Balance {
    income: string;
    outcome: string;
    total: string;
}

const Dashboard: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState<Balance>({} as Balance);

    useEffect(() => {
        async function loadTransactions(): Promise<void> {
            const response = await api.get('transactions');
            const APITramsactoions: Transaction[] = response.data.transactions;
            const APIBalance = response.data.balance;

            //format values
            const formatedTransactions = APITramsactoions.map(transaction => {
                let formatedValue = formatValue(transaction.value);
                if (transaction.type === 'outcome') {
                    formatedValue = '- ' + formatedValue;
                }
                return {
                    ...transaction,
                    formatedValue,
                    formattedDate: new Date(
                        transaction.created_at,
                    ).toLocaleDateString('pt-br'),
                };
            });

            setTransactions([...transactions, ...formatedTransactions]);
            setBalance({
                income: formatValue(APIBalance.income),
                outcome: formatValue(APIBalance.outcome),
                total: formatValue(APIBalance.total),
            });
        }

        loadTransactions();
    }, []);

    return (
        <>
            <Header />
            <Container>
                <CardContainer>
                    <Card>
                        <header>
                            <p>Entradas</p>
                            <img src={income} alt="Income" />
                        </header>
                        <h1 data-testid="balance-income">{balance.income}</h1>
                    </Card>
                    <Card>
                        <header>
                            <p>Saídas</p>
                            <img src={outcome} alt="Outcome" />
                        </header>
                        <h1 data-testid="balance-outcome">{balance.outcome}</h1>
                    </Card>
                    <Card total>
                        <header>
                            <p>Total</p>
                            <img src={total} alt="Total" />
                        </header>
                        <h1 data-testid="balance-total">{balance.total}</h1>
                    </Card>
                </CardContainer>

                <TableContainer>
                    <table>
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Preço</th>
                                <th>Categoria</th>
                                <th>Data</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map(transaction => {
                                return (
                                    <tr key={transaction.id}>
                                        <td className="title">
                                            {transaction.title}
                                        </td>
                                        <td className={transaction.type}>
                                            {transaction.formatedValue}
                                        </td>
                                        <td>{transaction.category.title}</td>
                                        <td>{transaction.formattedDate}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </TableContainer>
            </Container>
        </>
    );
};

export default Dashboard;
