/* global NAF, THREE */

export function whenEntityLoaded(entity, callback) {
  if (entity.hasLoaded) { callback(); }
  entity.addEventListener('loaded', function() {
    callback();
  });
}

export function createHtmlNodeFromString(str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  var child = div.firstChild;
  return child;
}

export function getCreator(el) {
  var components = el.components;
  if (components['networked']) {
    return components['networked'].data.creator;
  }
  return null;
}

export function getNetworkOwner(el) {
  var components = el.components;
  if (components['networked']) {
    return components['networked'].data.owner;
  }
  return null;
}

export function getNetworkId(el) {
  var components = el.components;
  if (components['networked']) {
    return components['networked'].data.networkId;
  }
  return null;
}

export function now() {
  return Date.now();
}

export function createNetworkId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Find the closest ancestor (including the passed in entity) that has a `networked` component
 * @param {ANode} entity - Entity to begin the search on
 * @returns {Promise<ANode>} An promise that resolves to an entity with a `networked` component
 */
export function getNetworkedEntity(entity) {
  return new Promise((resolve, reject) => {
    let curEntity = entity;

    while (curEntity && curEntity.components && !curEntity.components.networked) {
      curEntity = curEntity.parentNode;
    }

    if (!curEntity || !curEntity.components || !curEntity.components.networked) {
      return reject('Entity does not have and is not a child of an entity with the [networked] component ');
    }

    if (curEntity.hasLoaded) {
      resolve(curEntity);
    } else {
      curEntity.addEventListener('instantiated', () => {
        resolve(curEntity);
      }, { once: true });
    }
  });
}

export function takeOwnership(entity) {
  let curEntity = entity;

  while (curEntity && curEntity.components && !curEntity.components.networked) {
    curEntity = curEntity.parentNode;
  }

  if (!curEntity || !curEntity.components || !curEntity.components.networked) {
    throw new Error('Entity does not have and is not a child of an entity with the [networked] component ');
  }

  return curEntity.components.networked.takeOwnership();
}

export function isMine(entity) {
  let curEntity = entity;

  while (curEntity && curEntity.components && !curEntity.components.networked) {
    curEntity = curEntity.parentNode;
  }

  if (!curEntity || !curEntity.components || !curEntity.components.networked) {
    throw new Error('Entity does not have and is not a child of an entity with the [networked] component ');
  }

  // When remote networked entities are initially created, there's a frame delay before they are completely instantiated.
  // On that frame, data is undefined so we can't check the owner. In this instance we assume that the user is not the owner of the entity.
  if (!curEntity.components.networked.data) {
    return false;
  }

  return curEntity.components.networked.data.owner === NAF.clientId;
}

export function almostEqualVec3(u, v, epsilon) {
  return Math.abs(u.x - v.x) < epsilon && Math.abs(u.y - v.y) < epsilon && Math.abs(u.z - v.z) < epsilon;
}

export const vectorRequiresUpdate = epsilon => {
  return () => {
    let prev = null;

    return curr => {
      if (prev === null) {
        prev = new THREE.Vector3(curr.x, curr.y, curr.z);
        return true;
      } else if (!NAF.utils.almostEqualVec3(prev, curr, epsilon)) {
        prev.copy(curr);
        return true;
      }

      return false;
    };
  };
};
