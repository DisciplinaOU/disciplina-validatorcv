// @flow
/*
* File upload module. Implemented as React class component.
* Accepts file type ( accept ), multiple uploading ( isMultiple ) and dispatcher,
* that handles FileReader result. Error console.log added for debug.
* */
import * as React from 'react';
import CONSTANTS from '../../Constants';

type FileUploaderProps = {
  isMultiple: boolean,
  accept: string,
  dispatchBaseFile: (file: any) => void,
  file: any,
  dispatchValidate: () => Promise<any>,
  lang: string
}

export default class FileUploader extends React.Component<FileUploaderProps, {}> {
  static defaultProps = {
    isMultiple: false,
    accept: 'application/json',
    file: null
  };
  
  state = {
    fileName: ''
  };
  
  onSelectFile = (e: SyntheticInputEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      this.proceedFile(e.target.files[0]);
    }
  };
  
  onDrop = (e: { dataTransfer: { files: any[] }, preventDefault: () => void }): void => {
    e.preventDefault();
    this.proceedFile(e.dataTransfer.files[ 0 ]);
  };
  
  onFileLoaded = (file: any): void => {
    const { dispatchBaseFile } = this.props;
    dispatchBaseFile(file);
  };
  
  onErrorFileLoader = (error: any): void => {
    console.log(error);
  };
  
  handleDragOver = (e: SyntheticEvent<any>) => e.preventDefault();
  
  proceedFile = (file: File): void => {
    const reader = new FileReader();
    reader.onload = () => this.onFileLoaded(reader.result);
    reader.onerror = error => this.onErrorFileLoader(error);
    reader.readAsArrayBuffer(file);
    this.setState({ fileName: file.name });
  };
  
  onDragEnterHandler = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    document.getElementsByClassName('fileupload-dropzone')[ 0 ].classList.add('dropzone--dragging');
  };
  
  onDragLeaveHandler = (e: SyntheticEvent<any>) => {
    e.preventDefault();
    document.getElementsByClassName('fileupload-dropzone')[ 0 ].classList.remove('dropzone--dragging');
  };
  
  render() {
    const { isMultiple, accept, file, dispatchValidate, lang } = this.props;
    const { fileName } = this.state;
    return (
      <section
        className="fileupload-dropzone dropzone"
        onDragEnter={this.onDragEnterHandler}
        onDragExit={this.onDragLeaveHandler}
        onDragOver={this.handleDragOver}
        onDrop={this.onDrop}
      >
        {file ?
          <>
            <p className="text-center dropzone__legend">
              {CONSTANTS.TRANSLATIONS.DRAGZONE_SELECTED_1[lang]}
              <strong>{fileName}</strong>
              {CONSTANTS.TRANSLATIONS.DRAGZONE_SELECTED_2[lang]}
            </p>
            <label
              className="button dropzone__file-uploader btn btn--filled"
              onClick={dispatchValidate}
            >
              {CONSTANTS.TRANSLATIONS.VALIDATE_BTN[lang]}
            </label>
          </>
          :
          <>
            <p className="text-center dropzone__legend">
              {CONSTANTS.TRANSLATIONS.DRAGZONE_PREPARE_1[lang]}
              <br/>
              {CONSTANTS.TRANSLATIONS.DRAGZONE_PREPARE_2[lang]}
            </p>
            <label htmlFor="file-uploader" className="button dropzone__file-uploader btn btn--filled">
              {CONSTANTS.TRANSLATIONS.BROWSE_BTN[lang]}
              <input className="dropzone__input"
                     id="file-uploader"
                     type="file"
                     multiple={isMultiple}
                     accept={accept}
                     onChange={this.onSelectFile}
              />
            </label>
          </>
        }
      
      </section>
    );
  }
}
