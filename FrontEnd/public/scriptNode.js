window.onload = function () {
  (() => {
    if (!localStorage.getItem('faa7ef48-685c-4acc-9236-67be083f98ee')) {
      fetch('https://api.funnelsmap.com/funnel/node/counter', {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'only-if-cached'
        },
        body: JSON.stringify({
          nodeId: 'faa7ef48-685c-4acc-9236-67be083f98ee',
          funnelId: '5db5abe5ecd2e00027b73dc8',
        })
      }).then(() => { localStorage.setItem('faa7ef48-685c-4acc-9236-67be083f98ee', true); })
    };
  })();
};