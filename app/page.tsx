'use client';

import { Fragment, ReactNode, SetStateAction, SyntheticEvent, useState } from 'react';
import {
    Action,
    TableRow,
    doubleAfterSplitChanges,
    hardTableDefault,
    soft17HardChanges,
    soft17SoftChanges,
    softTableDefault,
    splitTableDefault,
} from './data/tables';

const actionColors: { [key in Action]: string } = {
    [Action.Hit]: 'red',
    [Action.Stand]: 'yellow',
    [Action.Double]: 'blue',
    [Action.Split]: 'green',
    [Action.Surrender]: 'white',
    [Action.None]: 'white',
};
interface actionChange {
    playerIndex: number; // TODO: this is a little fragile
    dealerUpCard: number;
    actionIfEnabled: Action;
    actionIfDisabled: Action;
}

const makeUpdates = (
    table: TableRow[],
    setTable: { (value: SetStateAction<TableRow[]>): void; (arg0: TableRow[]): void },
    ruleEnabled: boolean,
    actionChanges: actionChange[]
) => {
    const newTable = [...table];

    for (const change of actionChanges) {
        const { playerIndex, dealerUpCard, actionIfEnabled, actionIfDisabled } = change;

        newTable[playerIndex].cells[dealerUpCard - 2] = ruleEnabled
            ? actionIfEnabled
            : actionIfDisabled;
    }

    setTable(newTable);
};

export default function Home() {
    const [softTable, setSoftTable] = useState(softTableDefault);
    const [hardTable, setHardTable] = useState(hardTableDefault);
    const [splitTable, setSplitTable] = useState(splitTableDefault);
    const [doubleAfterSplit, setDoubleAfterSplit] = useState(true);
    const [hitSoft17, setHitSoft17] = useState(true);

    const handleDASChange = (e: SyntheticEvent) => {
        makeUpdates(splitTable, setSplitTable, !doubleAfterSplit, doubleAfterSplitChanges);
        setDoubleAfterSplit(x => !x);
    };

    const handleS17Change = (e: SyntheticEvent) => {
        makeUpdates(hardTable, setHardTable, !hitSoft17, soft17HardChanges);
        makeUpdates(softTable, setSoftTable, !hitSoft17, soft17SoftChanges);
        setHitSoft17(x => !x);
    };

    return (
        <div>
            <h1>Blackjack Basic Strategy</h1>
            <p>See how basic strategy changes by ruleset</p>

            <div>
                <label htmlFor="das">Double After Split</label>
                <input
                    id="das"
                    type="checkbox"
                    onChange={handleDASChange}
                    checked={!!doubleAfterSplit}
                />
                <br />
                <label htmlFor="s17">Dealer Hits Soft 17</label>
                <input id="s17" type="checkbox" onChange={handleS17Change} checked={!!hitSoft17} />
            </div>
            {[hardTable, softTable, splitTable].map((table, index) => {
                return (
                    <Fragment key={index}>
                        <Table>
                            {table.map((row, rowIndex) => {
                                return <Row header={row.header} cells={row.cells} key={rowIndex} />;
                            })}
                        </Table>
                    </Fragment>
                );
            })}
        </div>
    );
}

const Cell = (props: { header?: string; action?: Action }) => {
    const { header, action = Action.None } = props;

    return (
        <div
            style={{
                width: '25px',
                height: '25px',
                padding: '2px',
                fontWeight: header ? 800 : 400,
                backgroundColor: header ? 'white' : actionColors[action],
                textAlign: 'center',
            }}
        >
            {props.header ? props.header : props.action}
        </div>
    );
};

const Row = (props: { header: string; cells: Action[] }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Cell header={props.header} />
            {props.cells.map((cell, index) => {
                return <Cell action={cell} key={index} />;
            })}
        </div>
    );
};

const Table = (props: { children: ReactNode }) => {
    return (
        <div style={{ float: 'left', display: 'flex', flexDirection: 'column' }}>
            {props.children}
        </div>
    );
};
