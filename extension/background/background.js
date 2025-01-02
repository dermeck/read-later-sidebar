browser.action.onClicked.addListener(() => {
  browser.sidebarAction.open();
});

/*
setTimeout(() => {
  browser.runtime
    .sendMessage({
      type: "test",
      payload: { url: "url" },
    })
    .then(() => {
      return;
    })
    .catch((error) => {
      if (
        error.message ===
        "Could not establish connection. Receiving end does not exist."
      ) {
        console.log("moep");
        return;
      }
    });
}, 2500);
*/
