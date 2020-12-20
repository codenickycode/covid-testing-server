const test = async () => {
  const getData = async (data) => {
    throw new Error();
    // return data;
  };
  const asyncData = await getData('hello').catch((err) => {
    return 'caught the error';
  });
  console.log(asyncData);
};

test();
