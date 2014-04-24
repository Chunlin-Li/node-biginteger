var pedding = require('pedding');
var should = require('should');
var MutableBigInteger = require('../lib/MutableBigInteger');
var Long = require('long');

describe('MutableBigInteger', function () {

  it('#divide2()', function (done) {
    var a = new MutableBigInteger([373925724, 556284135, 1577689887, -1786225468]);
    var b = new MutableBigInteger([232830643, -1486618624]);
    var q = new MutableBigInteger();

    var r = a.divide(b, q);
    r.intLen.should.eql(2);
    r.offset.should.eql(2);
    JSON.stringify(r.value).should.eql(JSON.stringify([0, 0, 100666654, 829185220, 0]));
    
    done();
  });

  it('#compare()', function (done) {
    var a = new MutableBigInteger([373925724, 556284135, 1577689887, -1786225468]);
    var b = new MutableBigInteger([232830643, -1486618624]);
    var cmp = a.compare(b);
    should.exist(cmp);
    cmp.should.eql(1);
    done();
  });

  it('#divWord()', function (done) {
    var qWord = [0,0];
    var nChunk = Long.fromString('-8750763973399048587');
    var dh = -569676998;
    var m = new MutableBigInteger();
    m.divWord(qWord, nChunk, dh);
    qWord[0].should.eql(-1692222457);
    qWord[1].should.eql(-880736289);
    done();
  });

  it('Algorithm validation', function (done) {
    var nChunk,dhLong,qhat,qrem;

    nChunk = 5982811586;
    dhLong = 3725290298;
    qhat = Long.fromNumber(nChunk).div(Long.fromNumber(dhLong)).low;
    qhat.should.eql(1);

    qrem = Long.fromNumber(nChunk).subtract(Long.fromInt(qhat).multiply(Long.fromNumber(dhLong))).low;
    qrem.should.eql(-2037446008);

    //
    var product,difference,carry;
    
    product = Long.fromString('1983905792',10);
    difference = Long.fromString('-1673294219', 10);
    // console.log(product.shiftRight(32).low, difference.low >>>32, ~product.low >>> 32, '====', Long.fromNumber(difference.low >>>32).compare(Long.fromNumber(~product.low >>> 32)));
    carry = Long.fromNumber( product.shiftRight(32).low ).add( 
      Long.fromNumber(difference.low >>>32).compare(Long.fromNumber(~product.low >>> 32)) > 0 ? Long.fromInt(1) : Long.fromInt(0)
    );
    carry.toInt().should.eql(1);

    product = Long.fromString('5163600561190207488',10);
    difference = Long.fromString('-5163600561716973063', 10);
    carry = Long.fromNumber( product.shiftRight(32).low ).add( 
      Long.fromNumber(difference.low >>>32).compare(Long.fromNumber(~product.low >>> 32)) > 0 ? Long.fromInt(1) : Long.fromInt(0)
    );
    carry.toNumber().should.eql(1202244442);

    // 
    var dl = 1983905792;
    var qhat = 1;
    var estProduct = (dl >>> 32) * (qhat >>> 32);
    estProduct.should.eql(1983905792);
    
    estProduct = Long.fromNumber(dl >>> 32).multiply(Long.fromNumber(qhat >>> 32));
    estProduct.toNumber().should.eql(1983905792);

    // 
    var dh = -569676998;
    var dhLong = dh >>> 32;
    dhLong.should.eql(3725290298);
    
    // var nChunk = (1 << 32) | (1687844290 >>> 32);
    var a = Long.fromInt(1).shiftLeft(32);
    var b = Long.fromInt(1687844290);
    var nChunk = a.or(b).toNumber();
    nChunk.should.eql(5982811586);

    done();
  });

  it('#mulsub()', function (done) {
    var q,a,x,len,offset,m,carry;
    m = new MutableBigInteger();

    q = [0, 1687844290, 310611573, -526765575, 1485163584];
    a = [-569676998, 1983905792];
    x = 1;
    len = 2;
    offset = 0;

    carry = m.mulsub(q, a, x, len, offset);
    should.exist(carry);
    carry.should.eql(1);

    q = [0, 0, -1673294219, -526765575, 1485163584];
    a = [-569676998, 1983905792];
    x = -1692222457;
    len = 2;
    offset = 1;

    carry = m.mulsub(q, a, x, len, offset);
    should.exist(carry);
    carry.should.eql(-2037446009);

    done();
  });

  it('nChunk', function (done) {
    var nh = -2037446009;
    var nm = -1673294219;

    var a = Long.fromInt(nh).shiftLeft(32);
    var b = Long.fromNumber(nm >>> 32);
    var nChunk = a.or(b);
    nChunk.toString().should.eql('-8750763973399048587');
    done();
  })

  it('#unsignedLongCompare()', function (done) {

    var test = new MutableBigInteger();
    var estProduct = Long.fromString('1983905792', 10);
    var rs = Long.fromString('-8750763971415142795', 10);
    var b = test.unsignedLongCompare(estProduct, rs);
    b.should.be.false;

    estProduct = Long.fromString('5163600561190207488', 10);
    rs = Long.fromString('-3782733553887202823', 10);
    b = test.unsignedLongCompare(estProduct, rs);
    b.should.be.false;

    estProduct = Long.fromString('5059449554278023168', 10);
    rs = Long.fromString('-6469534718520603584', 10);
    b = test.unsignedLongCompare(estProduct, rs);
    b.should.be.false;

    done();
  });

  it('#rightShift()', function (done) {

    done();
  });

  it('#divideMagnitude()', function () {
    var divisor = [232830643, -1486618624];
    var quotient = new MutableBigInteger();
    var test = new MutableBigInteger();
    test.intLen = 4;
    test.offset = 0;
    test.value = [373925724, 556284135, 1577689887, -1786225468];

    var rem = test.divideMagnitude(divisor, quotient);
    rem.intLen.should.eql(2);
    rem.offset.should.eql(2);
    JSON.stringify(rem.value).should.eql(JSON.stringify([0, 0, 100666654, 829185220, 0]));
  });
  
  it('#leftShift()', function (done) {
    var oldValue = [0, 373925724, 556284135, 1577689887, -1786225468];

    var rem = new MutableBigInteger();
    rem.value = oldValue;
    rem.offset = 1;
    rem.intLen = 4;

    var shift = 4;
    rem.leftShift(shift);

    rem.offset.should.eql(0);
    rem.intLen.should.eql(5);
    JSON.stringify(oldValue).should.eql(JSON.stringify([1, 1687844290, 310611573, -526765575, 1485163584]));

    done();
  });

  it('#divideOneWord()', function (done) {
    var test = new MutableBigInteger();
    test.intLen = 4;
    test.offset = 0;
    test.value = [373925724, 556284135, 1577689887, -1786225468];
    
    var quotient = new MutableBigInteger();
    quotient.intLen = 0;
    quotient.offset = 0;
    quotient.value = [0];

    var rem = test.divideOneWord(2748, quotient);
    rem.should.eql(876);

    done();

  });
  
  it('#inverseMod32()', function (done) {

    var rs = MutableBigInteger.inverseMod32(687);
    rs.should.eql(1831769167);
    done();

  });

  it('#divide1()', function (done) {
    var q = new MutableBigInteger();
    var a2 = new MutableBigInteger([173466, -2045538581, -1617121781, -2105400024, 1731499034, -1310423851, -1140820895, 1936419172, 1028928351, 808464432, 808464697, 859186800, 1635018813, 791818289, 875574066, 875521400, 1952805486, 1634494820, 1697604207, 1902731630, 779777905, 791752749, 892808498, 909059700, 2037409085, 1919246692, 645163373, 1702065249, 1836072241, 859387190, 842610740, 925904944, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    var b2 = new MutableBigInteger([-1762010168, 650980105, -277349800, -810938427, 650643187, -2064988915, -201742470, -45408061, 1138000504, 1161038433, -1117962930, 1945245334, 155722333, -584039967, 1630462344, -893630601, -228578356, -2069725213, -305118052, 1469323366, -640692729, -1009689000, 197768393, 1028593914, -198778781, 826749249, -1399832152, 1460263485, -1651443110, 271031207, 1463691165, -1313081203]);

    var r = a2.divide(b2, q);
    r.intLen.should.eql(32);
    r.offset.should.eql(33);
    JSON.stringify(r.value).should.eql(JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1026875416, 838074214, 1678056733, 811425801, 967535925, 2066742, 44620736, 1924203482, 1650087857, -892397636, 569037126, -1929269903, 2106054259, 557995847, 1512938960, -483962321, 2029399138, -1704764822, 25367174, -1563114606, -699319237, -810057240, 997945214, -2120284262, 614849358, -90465900, -1147945412, 1563347272, 1498478984, -562069465, -732325432, 738592925]));
    
    done();
  });

  it('#divide2()', function (done) {
    var q = new MutableBigInteger();
    var a2 = new MutableBigInteger([373925724, 556284135, 1577689887, -1786225468]);
    var b2 = new MutableBigInteger([2748]);

    var r = a2.divide(b2, q);
    r.intLen.should.eql(1);
    r.offset.should.eql(0);
    JSON.stringify(r.value).should.eql(JSON.stringify([876]));
    
    done();
  });

});





