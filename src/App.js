import React, { Component } from 'react';
import './App.css';
import FileUploader from './Modules/FileUploader';
import CheckResult from './Components/CheckResult';
import Footer from './Components/Footer';
import HttpService from './Modules/Http';
import './App.css';
import discLogo from './img/disc_logo.svg';
import bgPng from './img/bg.png';
import LanguageSelector from './Components/LanguageSelector';
import CONSTANTS from './Constants';
import { CVApi } from './api/cv';

type AppType = {
  selectedLanguage: string,
  file: any,
  isChecked: boolean,
  isCvValid: boolean,
  txAddress: null | string,
}

const AppInitialState = {
  file: null,
  isChecked: false,
  isCvValid: false,
  txAddress: null
};

class App extends Component<{}, AppType> {
  state: AppType = {
    ...AppInitialState
  };

  componentDidMount(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || CONSTANTS.LANGUAGES.EN;
    this.changeLanguage(lang);
  }

  changeLanguage = (lang: string) => {
    this.setState({ selectedLanguage: lang.toUpperCase() });
    window.history.pushState({}, '', `?lang=${lang}`);
  };

  requestCheckAsync = async () => {
    try {
      const checkRes = await HttpService.put('/checkcv', this.state.file);
      this.setState({ isCvValid: checkRes.isValid });
    } catch (e) {
      console.log(e);
      this.setState({ isCvValid: false });
    } finally {
      this.setState({ isChecked: true });
    }
  };

  fileUploadHandler = async (file) => {
    try {
      const checkCVResponse = await CVApi.checkCV(file);

      if (!checkCVResponse.checkResult.isValid) throw Error('Invalid CV')

      const [firstCV] = Object.values(checkCVResponse.fairCV.cv);
      const [firstTx] = Object.values(firstCV);

      const data = await CVApi.getBlockInfoByTxId(firstTx.txId);

      const fileMerkleRoot = `0x${firstTx.val.root.root}`;
      const blockMerkleRoot = data.privateBlockHeader && data.privateBlockHeader.merkleRoot;

      this.setState({
        isChecked: true,
        isCvValid: blockMerkleRoot === fileMerkleRoot,
        txAddress: firstTx.txId,
      });
    } catch {
      this.setState({
        isChecked: true,
        isCvValid: false
      })
    }
  };

  clearForm = () => this.setState(state => ({ ...AppInitialState, selectedLanguage: state.selectedLanguage }));

  render() {
    const { isChecked, isCvValid, file, selectedLanguage, txAddress } = this.state;
    return (
      <>
        <div className="page">
          <LanguageSelector selectedLang={selectedLanguage} changeLanguage={this.changeLanguage} />
          <div className="container">
            <div className="logo">
              <img className="logo__img" src={discLogo} alt="Disciplina" /><span
                className="logo__text">{CONSTANTS.TRANSLATIONS.TITLE[selectedLanguage]}</span>
            </div>
            <div className="pageLegend">
              <p className="pageLegend__text">{CONSTANTS.TRANSLATIONS.SUBTITLE[selectedLanguage]}</p>
            </div>
            {!isChecked ?
              <FileUploader
                file={file}
                accept="pdf"
                dispatchBaseFile={this.fileUploadHandler}
                dispatchValidate={this.requestCheckAsync}
                lang={selectedLanguage}
              />
              : <section className="condition">
                <CheckResult txAddress={txAddress} isValid={isCvValid} lang={selectedLanguage} />
                {isCvValid ? (
                  <div className='buttons-group'>
                    <button
                      className="btn btn--back condition__back"
                      type="button"
                      name="button"
                      onClick={this.clearForm}
                    >
                      {CONSTANTS.TRANSLATIONS.CHECK_ANOTHER[selectedLanguage]}
                    </button>

                    {isChecked && isCvValid && (
                      <a target="_blank" rel="noopener noreferrer" href={`${process.env.ETHERSCAN_BASE_URL}/tx/${txAddress}`}>
                        <button
                          className="btn"
                          type="button"
                          name="button"
                          onClick={this.clearForm}
                        >
                          {CONSTANTS.TRANSLATIONS.SHOW_TRANSACTION[selectedLanguage]}
                        </button>
                      </a>
                    )}
                  </div>
                ) : (
                  <button
                    className="btn btn--back condition__back"
                    type="button"
                    name="button"
                    onClick={this.clearForm}
                  >
                    {CONSTANTS.TRANSLATIONS.CHECK_ANOTHER[selectedLanguage]}
                  </button>

                )}
              </section>
            }
          </div>
        </div>
        <div className="bg">
          <img src={bgPng} alt="" />
        </div>
        <Footer />
      </>
    );
  }
}

export default App;
