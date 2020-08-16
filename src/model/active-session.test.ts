import { ActiveSession } from './active-session';
import { Drink } from './drink';
import { VolumeUnit } from './unit';

describe('ActiveSession', () => {
  describe('#unitsConsumed', () => {
    it('should report units consumed accurately', () => {
      const session = new ActiveSession();
      session.addDrink(new Drink(568, VolumeUnit.Milliliters, 5.2));
      session.addDrink(new Drink(12, VolumeUnit.Ounces, 7.9));

      expect(session.unitsConsumed).toBeCloseTo(5.757, 3);
    });
  });
});