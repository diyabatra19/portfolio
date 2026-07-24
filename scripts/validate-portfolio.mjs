import assert from 'node:assert/strict';
import { portfolioData } from '../src/data/portfolio.js';

const { videos, creatorProjects, rails } = portfolioData;
const videoIds = videos.map((video) => video.id);
const creatorById = Object.fromEntries(
  creatorProjects.map((creator) => [creator.id, creator]),
);
const primaryCreators = creatorProjects
  .filter((creator) => creator.type === 'primary')
  .sort((a, b) => a.priority - b.priority);
const marqueeCreators = creatorProjects
  .filter((creator) => creator.includeInCreatorStrip)
  .sort((a, b) => a.priority - b.priority);
const railIds = rails.flatMap((rail) => rail.videoIds);

assert.equal(videos.length, 23, 'The featured dataset must contain 23 videos.');
assert.equal(new Set(videoIds).size, 23, 'Featured video IDs must be unique.');
assert.equal(creatorProjects.length, 7, 'There must be seven creator collections.');
assert.equal(primaryCreators.length, 5, 'There must be five primary client sections.');
assert.deepEqual(
  primaryCreators.map((creator) => creator.layout),
  ['video-left', 'video-right', 'video-left', 'video-right', 'video-left'],
  'Primary clients must retain the alternating layout.',
);
assert.deepEqual(
  marqueeCreators.map((creator) => creator.id),
  [
    'valekis',
    'popcorn-panda-plays',
    'lampsie',
    'swonkyneb',
    'valekis-and-ashley',
    'froze',
  ],
  'Creator strip order is incorrect.',
);
assert.equal(
  creatorById.kazed.includeInCreatorStrip,
  false,
  'Kazed must not appear in the creator strip.',
);
assert.equal(
  creatorById.kazed.hideSubscriberCount,
  true,
  'Kazed subscriber count must remain hidden.',
);
assert.equal(creatorById.kazed.subscriberCount, undefined);
assert.equal(creatorById.valekis.videoIds.length, 6);
assert.equal(new Set(creatorById.valekis.videoIds).size, 6);
assert.equal(creatorById['popcorn-panda-plays'].videoIds.length, 3);
assert.equal(creatorById.lampsie.videoIds.length, 1);
assert.equal(creatorById.swonkyneb.videoIds.length, 4);
assert.equal(creatorById.kazed.videoIds.length, 1);
assert.equal(creatorById['valekis-and-ashley'].videoIds.length, 3);
assert.equal(creatorById.froze.videoIds.length, 5);
assert.equal(
  videos.filter((video) => video.aspectRatio === '9:16').length,
  5,
  'Exactly five supplied projects must be Shorts.',
);
assert.equal(new Set(railIds).size, 23, 'A video is duplicated across the three rails.');
assert.deepEqual(
  [...new Set(railIds)].sort(),
  [...videoIds].sort(),
  'The three rails must cover every featured project exactly once.',
);
assert.deepEqual(
  rails.map((rail) => rail.direction),
  ['right', 'left', 'right'],
  'Rail movement directions are incorrect.',
);

console.log('Portfolio data validated: 23 videos, 7 creators, 5 primary clients, 5 Shorts.');
