import contract from "@truffle/contract"


export const loadContract = async(name ,provider)=>{
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();
    //getting instance of contract
    const _contract = contract(Artifact)
    _contract.setProvider(provider)
    const deployedContract = await _contract.deployed();
    // this deployedContract will go to App.js to connect with contract
    return deployedContract;
}