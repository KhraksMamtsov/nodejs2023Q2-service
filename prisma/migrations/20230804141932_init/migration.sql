-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "password" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Album" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" UUID
);

-- CreateTable
CREATE TABLE "Track" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "artistId" UUID,
    "albumId" UUID
);

-- CreateTable
CREATE TABLE "TracksOnFavorites" (
    "trackId" UUID NOT NULL,
    "favoritesId" UUID NOT NULL,

    CONSTRAINT "TracksOnFavorites_pkey" PRIMARY KEY ("trackId","favoritesId")
);

-- CreateTable
CREATE TABLE "ArtistsOnFavorites" (
    "artistId" UUID NOT NULL,
    "favoritesId" UUID NOT NULL,

    CONSTRAINT "ArtistsOnFavorites_pkey" PRIMARY KEY ("artistId","favoritesId")
);

-- CreateTable
CREATE TABLE "AlbumsOnFavorites" (
    "albumId" UUID NOT NULL,
    "favoritesId" UUID NOT NULL,

    CONSTRAINT "AlbumsOnFavorites_pkey" PRIMARY KEY ("albumId","favoritesId")
);

-- CreateTable
CREATE TABLE "Favorites" (
    "id" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_id_key" ON "Artist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Album_id_key" ON "Album"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Track_id_key" ON "Track"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_id_key" ON "Favorites"("id");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracksOnFavorites" ADD CONSTRAINT "TracksOnFavorites_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracksOnFavorites" ADD CONSTRAINT "TracksOnFavorites_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "Favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistsOnFavorites" ADD CONSTRAINT "ArtistsOnFavorites_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistsOnFavorites" ADD CONSTRAINT "ArtistsOnFavorites_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "Favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumsOnFavorites" ADD CONSTRAINT "AlbumsOnFavorites_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumsOnFavorites" ADD CONSTRAINT "AlbumsOnFavorites_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "Favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
