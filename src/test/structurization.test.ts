import * as assert from 'assert';
import { structurize } from '../utils';

suite('Structurize', () => {
  const cases = [
    {
      input: 'text-sky-500 bg-indigo-200',
      structure: {
        'text-sky-500': null,
        'bg-indigo-200': null,
      },
    },
    {
      input: 'text-sky-500 hover:text-sky-600',
      structure: {
        'text-sky-500': null,
        hover: {
          'text-sky-600': null,
        },
      },
    },
    {
      input: 'text-sky-100 hover:text-sky-200 focus:text-sky-300',
      structure: {
        'text-sky-100': null,
        hover: {
          'text-sky-200': null,
        },
        focus: {
          'text-sky-300': null,
        },
      },
    },
    {
      input: 'ring-gray-900/5 sm:mx-auto sm:max-w-lg',
      structure: {
        'ring-gray-900/5': null,
        sm: {
          'mx-auto': null,
          'max-w-lg': null,
        },
      },
    },
    {
      input: 'inset-0 bg-[url(/img/grid.svg)]',
      structure: {
        'inset-0': null,
        'bg-[url(/img/grid.svg)]': null,
      },
    },
    {
      input:
        'bg-white focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500',
      structure: {
        'bg-white': null,
        focus: {
          'ring-1': null,
          'ring-sky-500': null,
          invalid: {
            'border-pink-500': null,
            'ring-pink-500': null,
          },
        },
        invalid: {
          'border-pink-500': null,
          'text-pink-600': null,
        },
      },
    },
    {
      input: 'group/item hover:bg-slate-100',
      structure: {
        'group/item': null,
        hover: {
          'bg-slate-100': null,
        },
      },
    },
    {
        input: 'hidden group-[.is-published]:block',
        structure: {
            'hidden': null,
            'group-[.is-published]': {
                'block': null
            }
        }
    },
    {
      input: '*:rounded-full *:border-sky-100 dark:text-sky-300 dark:*:border-sky-500/15',
      structure: {
        '*': {
          'rounded-full': null,
          'border-sky-100': null,
        },
        dark: {
          'text-sky-300': null,
          '*': {
            'border-sky-500/15': null,
          },
        },
      },
    },
    {
      input: "after:content-['*'] after:text-red-500 block text-sm",
      structure: {
        after: {
          "content-['*']": null,
          'text-red-500': null,
        },
        block: null,
        'text-sm': null,
      },
    },
    {
      input:
        "aria-[sort=ascending]:bg-[url('/img/down-arrow.svg')] aria-[sort=descending]:bg-[url('/img/up-arrow.svg')]",
      structure: {
        'aria-[sort=ascending]': {
          "bg-[url('/img/down-arrow.svg')]": null,
        },
        'aria-[sort=descending]': {
          "bg-[url('/img/up-arrow.svg')]": null,
        },
      },
    },
  ];

  for (const c of cases) {
    test(c.input, () => {
      assert.deepEqual(structurize(c.input), c.structure);
    });
  }
});
