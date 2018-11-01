
  function setSaveDisableStatus(elref, isdirty) {
    if(isdirty) {
      return 'enabled';
    }
    return 'disabled';
  }