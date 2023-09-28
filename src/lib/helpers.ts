export function isSameUint8Array(thisArray: Uint8Array, other: Uint8Array) 
{
    if (thisArray.length !== other.length) 
    {
        return false;
    }
    for (let i = 0; i < thisArray.length; i++) 
    {
        if (thisArray[i] !== other[i]) 
        {
            return false;
        }
    }
    return true;
};

export function getPollIDFromURL(searchParams: URLSearchParams): Uint8Array | null {
  const pollID = searchParams.get('poll_id');
  if (pollID) {
    try {
      const asString = atob(pollID);
      console.log(asString);
      const asUint8Array = new Uint8Array(asString.split(',').map(id => parseInt(id)));
      console.log(asUint8Array);
      return asUint8Array;
    } catch (e) {
      console.error(e);
      return null;
    }
  } else {
    return null;
  }
}
