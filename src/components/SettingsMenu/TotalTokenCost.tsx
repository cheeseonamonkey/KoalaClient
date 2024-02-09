import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useStore from '@store/store';

import Toggle from '@components/Toggle/Toggle';

import { TotalTokenUsed } from '@type/chat';

import CalculatorIcon from '@icon/CalculatorIcon';

type CostMapping = { model: number; cost: number }[];

const tokenCostToCost = (tokenCost: TotalTokenUsed[number], model: number) => {
  if (!tokenCost) return 0;
  const modelDefs = useStore((state) => state.modelDefs);

  const modelDef = modelDefs[model];

  if (!modelDef) return 0;

  const completionCost =
    (modelDef.completion_cost_1000 / 1000) * tokenCost.completionTokens;
  const promptCost =
    (modelDef.completion_cost_1000 / 1000) * tokenCost.promptTokens;
  return completionCost + promptCost;
};

const TotalTokenCost = () => {
  const { t } = useTranslation(['main', 'model']);

  const totalTokenUsed = useStore((state) => state.totalTokenUsed);
  const setTotalTokenUsed = useStore((state) => state.setTotalTokenUsed);
  const countTotalTokens = useStore((state) => state.countTotalTokens);

  const [costMapping, setCostMapping] = useState<CostMapping>([]);

  const resetCost = () => {
    setTotalTokenUsed({});
  };

  useEffect(() => {
    const updatedCostMapping: CostMapping = [];
    Object.entries(totalTokenUsed).forEach(([key, tokenCost]) => {
      const model = parseInt(key, 10);
      if (!isNaN(model)) {
        const cost = tokenCostToCost(tokenCost, model);
        updatedCostMapping.push({ model, cost });
      }
    });

    setCostMapping(updatedCostMapping);
  }, [totalTokenUsed]);

  return countTotalTokens ? (
    <div className='flex flex-col items-center gap-2 pt-2'>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left'>
          <thead className='text-xs text-custom-white uppercase bg-neutral-dark'>
            <tr>
              <th className='px-4 py-2'>{t('model', { ns: 'model' })}</th>
              <th className='px-4 py-2'>USD</th>
            </tr>
          </thead>
          <tbody>
            {costMapping.map(({ model, cost }) => (
              <tr
                key={model}
                className='bg-neutral-light text-custom-white border-b-2 border-neutral-base'
              >
                <td className='px-4 py-2'>{model}</td>
                <td className='px-4 py-2'>{cost.toPrecision(3)}</td>
              </tr>
            ))}
            <tr className='bg-neutral-light text-custom-white font-bold'>
              <td className='px-4 py-2'>{t('total', { ns: 'main' })}</td>
              <td className='px-4 py-2'>
                {costMapping
                  .reduce((prev, curr) => prev + curr.cost, 0)
                  .toPrecision(3)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='btn btn-neutral cursor-pointer' onClick={resetCost}>
        {t('resetCost', { ns: 'main' })}
      </div>
    </div>
  ) : (
    <></>
  );
};

export const TotalTokenCostToggle = () => {
  const { t } = useTranslation('main');

  const setCountTotalTokens = useStore((state) => state.setCountTotalTokens);

  const [isChecked, setIsChecked] = useState<boolean>(
    useStore.getState().countTotalTokens
  );

  useEffect(() => {
    setCountTotalTokens(isChecked);
  }, [isChecked]);

  return (
    <Toggle
      label={t('countTotalTokens') as string}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export const TotalTokenCostDisplay = () => {
  const totalTokenUsed = useStore((state) => state.totalTokenUsed);

  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    let updatedTotalCost = 0;

    Object.entries(totalTokenUsed).forEach(([key, tokenCost]) => {
      const model = parseInt(key, 10);
      if (!isNaN(model)) {
        updatedTotalCost += tokenCostToCost(tokenCost, model);
      }
    });

    setTotalCost(updatedTotalCost);
  }, [totalTokenUsed]);

  return (
    <a className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-neutral-base/10 transition-colors duration-200 text-custom-white text-sm'>
      <CalculatorIcon />
      {`USD ${totalCost.toPrecision(3)}`}
    </a>
  );
};

export default TotalTokenCost;
