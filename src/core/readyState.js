/* global CustomEvent */
class ReadyState {
  constructor() {
    this._canInitializeElements = false;
  }

  get canInitializeElements() {
    return this._canInitializeElements;
  }

  /**
   * Waits for the document to be ready.
   */
  waitForDocumentReadyState() {
    if (document.readyState === 'complete') {
      this.emitReady();
      return;
    }

    document.addEventListener('readystatechange', function onReadyStateChange() {
      if (document.readyState !== 'complete') { return; }
      document.removeEventListener('readystatechange', onReadyStateChange);
      readyState.emitReady();
    });
  }

  /**
   * Signals A-Frame that everything is ready to initialize.
   */
  emitReady() {
    console.log('emitReady', this._canInitializeElements);
    if (this._canInitializeElements) { return; }
    this._canInitializeElements = true;
    setTimeout(function() {
      document.dispatchEvent(new CustomEvent('aframeready'));
    });
  }
}
export const readyState = new ReadyState();
