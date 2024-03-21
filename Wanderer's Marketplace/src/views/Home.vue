<script>
export default {
  name: 'Home'
}
</script>

<template>
  <div id="container">
    <div id="FirstDiv">
      <h1 id="YourPurchases">Your Purchases</h1>
    </div>
    
    <div id="SecondDiv">
      <h1>Listings here</h1>
    </div>
    
    <div id="ThirdDiv">
      <h1 id="GoodsYouAreHelpingToBuy">Goods You Are Helping To Buy</h1>
    </div>

    <div id="FourthDiv">
      <h1>Listings here</h1>
    </div>
  </div>
</template>

<style>
  #container {
    display: flex;
    flex-direction: column;
  }
  
  #YourPurchases, #GoodsYouAreHelpingToBuy {
    color: white;
  }

  #FirstDiv, #ThirdDiv {
    background-color: #051e55;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #SecondDiv, #FourthDiv {
    background-color: #b3e3eb;
    height: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h1 {
    margin: 0;
  }
</style>