// @flow
import React from 'react';
import CONSTANTS from '../Constants';

type CheckResultProps = {
  isValid: boolean,
  lang: string
}

const CheckResult = ({ isValid, lang }: CheckResultProps) => (
  <div
    className={`condition__status ${isValid ? 'condition__status--ok' : 'condition__status--error'}`}>
    {isValid ? CONSTANTS.TRANSLATIONS.VALID[lang] : CONSTANTS.TRANSLATIONS.NOT_VALID[lang]}
  </div>
);

export default CheckResult;
