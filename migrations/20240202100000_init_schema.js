/**
 * @param {import('knex')} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('cities', (table) => {
    table.bigIncrements('id').primary();
    table.string('name', 120).notNullable();
    table.string('country_code', 2).notNullable().defaultTo('CN');
    table.decimal('lat', 10, 6).notNullable();
    table.decimal('lng', 10, 6).notNullable();
    table.string('timezone', 64).notNullable().defaultTo('Asia/Shanghai');
    table.smallint('status').notNullable().defaultTo(1);
    table.timestamps(true, true);
    table.index(['status']);
  });

  await knex.schema.createTable('hotels', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('city_id').notNullable().references('id').inTable('cities').onDelete('RESTRICT');
    table.string('name', 160).notNullable();
    table.string('address', 255).defaultTo('');
    table.decimal('star_rating', 2, 1).defaultTo(0);
    table.decimal('min_price_cache', 10, 2).defaultTo(0);
    table.decimal('lat', 10, 6);
    table.decimal('lng', 10, 6);
    table.string('check_in_time', 8).defaultTo('14:00');
    table.string('check_out_time', 8).defaultTo('12:00');
    table.smallint('status').notNullable().defaultTo(1);
    table.jsonb('extra').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.timestamps(true, true);
    table.index(['city_id', 'status']);
    table.index(['name']);
  });

  await knex.schema.createTable('hotel_photos', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('hotel_id').notNullable().references('id').inTable('hotels').onDelete('CASCADE');
    table.string('url', 512).notNullable();
    table.string('type', 32).notNullable().defaultTo('cover');
    table.integer('sort_order').defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('tags', (table) => {
    table.bigIncrements('id').primary();
    table.string('code', 64).notNullable().unique();
    table.string('name', 64).notNullable();
    table.string('type', 32).notNullable().defaultTo('theme');
    table.jsonb('extra').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.smallint('status').notNullable().defaultTo(1);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('hotel_tags', (table) => {
    table.bigInteger('hotel_id').notNullable().references('id').inTable('hotels').onDelete('CASCADE');
    table.bigInteger('tag_id').notNullable().references('id').inTable('tags').onDelete('CASCADE');
    table.primary(['hotel_id', 'tag_id']);
  });

  await knex.schema.createTable('quick_filters', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('tag_id').references('id').inTable('tags').onDelete('SET NULL');
    table.string('label', 64).notNullable();
    table.string('jump_type', 32).notNullable().defaultTo('hotel_list');
    table.jsonb('jump_payload').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.string('platform', 16).notNullable().defaultTo('mobile');
    table.smallint('status').notNullable().defaultTo(1);
    table.integer('priority').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('rooms', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('hotel_id').notNullable().references('id').inTable('hotels').onDelete('CASCADE');
    table.string('name', 120).notNullable();
    table.decimal('area', 5, 2);
    table.string('bed_type', 32);
    table.smallint('capacity');
    table.smallint('status').notNullable().defaultTo(1);
    table.jsonb('extra').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.timestamps(true, true);
  });

  await knex.schema.createTable('rate_plans', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('room_id').notNullable().references('id').inTable('rooms').onDelete('CASCADE');
    table.string('name', 120).notNullable();
    table.string('meal_plan', 32).defaultTo('none');
    table.boolean('refundable').defaultTo(true);
    table.string('currency', 3).notNullable().defaultTo('CNY');
    table.smallint('status').notNullable().defaultTo(1);
    table.jsonb('extra').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.timestamps(true, true);
  });

  await knex.schema.createTable('room_price_calendar', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('rate_plan_id').notNullable().references('id').inTable('rate_plans').onDelete('CASCADE');
    table.date('stay_date').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.integer('inventory').notNullable().defaultTo(0);
    table.integer('sold').notNullable().defaultTo(0);
    table.smallint('status').notNullable().defaultTo(1);
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.unique(['rate_plan_id', 'stay_date']);
    table.index(['stay_date']);
  });

  await knex.schema.createTable('banners', (table) => {
    table.bigIncrements('id').primary();
    table.string('title', 128).notNullable();
    table.string('image_url', 512).notNullable();
    table.string('jump_type', 32).notNullable().defaultTo('hotel_detail');
    table.jsonb('jump_payload').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.string('platform', 16).notNullable().defaultTo('mobile');
    table.smallint('status').notNullable().defaultTo(1);
    table.integer('priority').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('banners');
  await knex.schema.dropTableIfExists('room_price_calendar');
  await knex.schema.dropTableIfExists('rate_plans');
  await knex.schema.dropTableIfExists('rooms');
  await knex.schema.dropTableIfExists('quick_filters');
  await knex.schema.dropTableIfExists('hotel_tags');
  await knex.schema.dropTableIfExists('tags');
  await knex.schema.dropTableIfExists('hotel_photos');
  await knex.schema.dropTableIfExists('hotels');
  await knex.schema.dropTableIfExists('cities');
};