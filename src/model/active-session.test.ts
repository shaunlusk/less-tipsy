import { ActiveSession } from './active-session';
import { Drink } from './drink';
import { VolumeUnit } from './unit';

describe('ActiveSession', () => {
  describe('#unitsConsumed', () => {
    it('should report units consumed accurately', () => {
      const session = new ActiveSession(4, 14, 3);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      session.addDrink(new Drink(12, VolumeUnit.Ounces, 7.9));

      expect(session.unitsConsumed).toBeCloseTo(5.757, 3);
    });
  });
  describe('#rollingWeekly', () => {
    it('should reflect drinks added', () => {
      const session = new ActiveSession(4, 14, 3);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.rollingWeekly).toBeCloseTo(3 + 2.95, 2);
    });
  });
  describe('#isSessionOk', () => {
    it('should be ok', () => {
      const session = new ActiveSession(4, 14, 3);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.isSessionOk).toBeTruthy();
    });
    it('should not be ok', () => {
      const session = new ActiveSession(2, 14, 3);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.isSessionOk).toBeFalsy();
    });
  });
  describe('#isWeeklyOk', () => {
    it('should be ok', () => {
      const session = new ActiveSession(4, 14, 3);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.isWeeklyOk).toBeTruthy();
    });
    it('should not be ok', () => {
      const session = new ActiveSession(2, 5, 3);
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      
      expect(session.isWeeklyOk).toBeFalsy();
    });
  });
});