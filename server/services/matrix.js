
const Vector = () => {
  /**
   * Perform mathematic vector multiplication
   * @param {[type]} v1 [description]
   * @param {[type]} v2 [description]
   */
  const addVectors = (v1, v2) => (
    v1.map( (item, index) => v1[index] + v2[index])
  );

  /**
   * [subtractVector description]
   * @param  {[Array]} v1 [description]
   * @param  {[Array]} v2 [description]
   * @return {[Array]}    [description]
   */
  const subtractVectors = (v1, v2) => (
    v1.map( (item, index) => v1[index] - v2[index])
  );

  /**
   * calculates the change between two vector elements
   * @param  {[type]} vector [description]
   * @param  {[type]} index  [description]
   * @return {[type]}        [description]
   */
  const delta = (vector, index, multiplier=1) => {
    if(vector.length == 0 || index === 0 || vector.length <= index) return 0;
    return multiplier * (Number(vector[index]) - Number(vector[index-1]));
  };

  /**
   * returns array of the same length as input, first number is 0 (no change yet)
   * @param  {[Array]} vector [description]
   * @return {[Array]}        [description]
   */
  const rateOfChange = (vector, multiplier=1) => (
    vector.map( (item,i) => delta(vector, i, multiplier) )
  );
  return { addVectors, subtractVectors, rateOfChange, }
};

export default Vector();
