import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme'
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import CounterSave from '../CounterSave';
import Store from '../../../store';
import API from '../../../api';

chai.use(chaiEnzyme());

describe('CounterSave', () => {
  let wrapper;
  let fakes;
  beforeEach(() => {
    Store.reset();
    wrapper = shallow(<CounterSave />);
    fakes = sinon.collection;
  });
  afterEach(() => {
    wrapper.unmount();
    fakes.restore();
  });
  describe('#save', () => {
    it('calls API.saveFile with the saveFile from the Store when clicked', () => {
      Store.increments = 3;
      Store.decrements = 2;
      const apiSpy = fakes.stub(API, 'saveFile');
      wrapper.find('#save').simulate('click');
      expect(apiSpy.calledOnce).to.be.true;
      expect(API.saveFile.getCall(0).args[0]).to.deep.equal(Store.saveFile);
    });
  });

  describe('#load', () => {
    it('loads the saveFile from API.saveFile() when clicked', (done) => {
      const saveFile = {
        increments: 6,
        decrements: 3,
      };
      const apiStub = fakes.stub(API, 'getSaveFile').returns(Promise.resolve(saveFile).then(done()));
      const storeSpy = fakes.stub(Store, 'loadSaveFile');
      wrapper.find('#load').simulate('click');
      expect(apiStub.calledOnce).to.be.true;
      expect(storeSpy.calledOnce).to.be.true;
      expect(Store.saveFile).to.deep.equal(saveFile);
    });
  });
});
