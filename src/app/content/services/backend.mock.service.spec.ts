import { BackendMockService,  } from './backend.mock.service';
import { IItem } from '@app/content/models';

describe('BackendMockService', () => {
  const api = new BackendMockService();

  it('fetchAll()', () => {
    api.fetchAll().subscribe(resp => {
      expect(resp).toBeDefined();
      expect(resp.categories.length).toBe(6);
      expect(resp.items.length).toBe(6);
    });
  });

  it('addCategory()', () => {
    api.addCategory('newCategory').subscribe(resp => {
      expect(api._data.categories.length).toBe(7);
      expect(api._data.categories[6]).toBe(resp);
      expect(resp.id).toBe(7);
    });
  });

  it('updateCategory()', () => {
    const updated = { id: 7, name: 'updated' };
    api.updateCategory(updated).subscribe(() => {
      expect(api._data.categories[6].name).toBe(updated.name);
    });
  });

  it('removeCategory()', () => {
    api.removeCategory({ id: 7, cascade: false }).subscribe(() => {
      expect(api._data.categories.length).toBe(6);
      const deletedCate = api._data.categories.find(x => x.id === 7);
      expect(deletedCate).toBeUndefined();
    });
  });

  it('removeCategory() - that had items - cascade = false', () => {
    api.removeCategory({ id: 5, cascade: false }).subscribe(() => {
      expect(api._data.categories.length).toBe(5);
      expect(api._data.items.length).toBe(6);
      const item = api._data.items.find(x => x.name === 'Ffgf');
      expect(item).toBeDefined();
      if (item) {
        expect(item.category_id).toBeUndefined();
      }
    });
  });

  it('removeCategory() - that had items - cascade = true', () => {
    api.removeCategory({ id: 4, cascade: true }).subscribe(() => {
      expect(api._data.categories.length).toBe(4);
      expect(api._data.items.length).toBe(5);
      const item = api._data.items.find(x => x.name === 'My Site');
      expect(item).toBeUndefined();
    });
  });

  it('addItem()', () => {
    const item: IItem = {
      category_id: 3,
      name: 'newItem',
      password: 'pwd',
      id: -1
    };
    api.addItem({ item, auto_pass: false, genopts: {} }).subscribe(resp => {
      expect(api._data.items.length).toBe(6);
      expect(resp).toBe(api._data.items[5]);
      expect(resp.id).toBe(7);
    });
  });

  it('updateItem()', () => {
    const item: IItem = {
      id: 7,
      category_id: 3,
      name: 'updatedItem',
      password: 'updatedpwd'
    };
    api.updateItem({ item, auto_pass: false, genopts: {} }).subscribe(resp => {
      expect(resp.name).toBe(item.name);
      expect(resp.password).toBe(item.password);
      const ix = api._data.items.findIndex(x => x.id === item.id);
      expect(api._data.items[ix].name).toBe(item.name);
      expect(api._data.items[ix].password).toBe(item.password);
    });
  });

  it('removeItem()', () => {
    api.removeItem(7).subscribe(() => {
      expect(api._data.items.length).toBe(5);
      const deletedItem = api._data.items.find(x => x.id === 7);
      expect(deletedItem).toBeUndefined();
    });
  });
});
