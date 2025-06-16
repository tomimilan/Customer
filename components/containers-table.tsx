          <TableHeader>
            <TableRow>
              <SortableHeader
                column="number"
                label="Número"
                icon={Hash}
                sortKey="number"
                currentSort={sortField}
                direction={sortField === "number" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="type"
                label="Tipo"
                icon={Package}
                sortKey="type"
                currentSort={sortField}
                direction={sortField === "type" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <SortableHeader
                column="status"
                label="Estado"
                icon={CheckCircle}
                sortKey="status"
                currentSort={sortField}
                direction={sortField === "status" ? sortDirection : null}
                onSort={handleSort}
                className="text-center"
              />
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedContainers.map((container) => (
              <TableRow key={container.id}>
                <TableCell className="text-center">{container.number}</TableCell>
                <TableCell className="text-center">{container.type}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      container.status === "activo"
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    }
                  >
                    {container.status === "activo" ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(container.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(container.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody> 