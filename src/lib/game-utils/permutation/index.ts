const generatePermutation = (arr: Number[])=>{
    let resultArr: (Number[])[] = [];
    if(arr.length === 0) return [];
    if(arr.length === 1) return [arr];
    
    for(let i =0 ; i<arr.length ; i++)
    {
        const currentElement = arr[i];
        
        const otherElements = arr.slice(0,i).concat(arr.slice(i+1));
        const swappedPermutation = generatePermutation(otherElements);
        
        for(let j =0 ; j < swappedPermutation.length ; j++)
        {
            const finalSwappedPermutation = [currentElement].concat(swappedPermutation[j]);
            resultArr.push(finalSwappedPermutation);
        }
    }
    
    return resultArr;
}

export const getUniquePermutation = (arrNumber: Number[])=>{
    var temp: Number[] = [];
    const listofPermutations = 
        generatePermutation(arrNumber)
        .map(num => Number(num.join('')));
    listofPermutations.forEach(
        number =>{
            const isNotExist = temp.includes(number) == false;
            if(isNotExist) temp.push(number)
    })
    return temp
}